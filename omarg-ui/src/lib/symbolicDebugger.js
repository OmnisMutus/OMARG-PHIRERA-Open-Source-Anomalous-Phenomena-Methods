/**
 * symbolicDebugger.js
 * 
 * Ports the Python logic for text hashing and Sephira diagnosis into JS.
 * STRICT ISOMORPHISM: This file reads symbolic_api.json to ensure 100% 
 * parity with the Python symbolic_debugger.py.
 */

import API from './symbolic_api.json' with { type: "json" };

// A simple deterministic hash function to convert a string to a chaotic array of integers (Tohu)
export function stringToChaoticArray(str) {
    if (!str) return [];
    
    // Create a deterministic array of 12 numbers from the string
    let arr = [];
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        // Scramble it deterministically
        let scrambled = (charCode * 31 + i * 17) % 100;
        arr.push(scrambled);
    }
    
    // Ensure we have at least 12 elements (if string is short)
    while (arr.length < 12) {
        let last = arr[arr.length - 1] || 42;
        arr.push((last * 7 + 13) % 100);
    }
    
    // Convert to objects with unique IDs for React rendering
    return arr.map((val, idx) => ({ id: `node-${idx}-${val}`, value: val }));
}

// Prepare the keyword map just like Python:
// keyword_map[kw.lower()] = seph
const keywordMap = {};
for (const [seph, data] of Object.entries(API.sephirot)) {
    for (const kw of data.keywords) {
        keywordMap[kw.toLowerCase()] = seph;
    }
}

// Scans text for keywords to determine the dominant Sephira
export function diagnoseSephira(text) {
    // Tokenize exactly like Python: re.findall(r"\b\w+\b", text.lower())
    const lowerText = text.toLowerCase();
    const tokens = lowerText.match(/\b\w+\b/g) || [];
    
    // Count occurrences
    const counts = {};
    const insertionOrder = []; // To break ties exactly like Python's Counter
    
    for (const t of tokens) {
        if (keywordMap[t]) {
            const seph = keywordMap[t];
            if (!counts[seph]) {
                counts[seph] = 0;
                insertionOrder.push(seph);
            }
            counts[seph] += 1;
        }
    }
    
    if (Object.keys(counts).length === 0) {
        return null;
    }
    
    // Find highest score (most_common(1)[0][0] in Python)
    // Python's Counter.most_common() sorts by count descending, then by insertion order.
    let dominant = null;
    let maxCount = -1;
    
    for (const seph of insertionOrder) {
        if (counts[seph] > maxCount) {
            maxCount = counts[seph];
            dominant = seph;
        }
    }
    
    return dominant;
}

// Calculates H_s (Entropy) based on the unique-adjacent-pair rule
export function calculateEntropy(text) {
    const lowerText = text.toLowerCase();
    const tokens = lowerText.match(/\b\w+\b/g) || [];
    
    if (tokens.length < 2) {
        return 0.0;
    }
    
    let totalPairs = 0;
    const uniquePairs = new Set();
    
    for (let i = 0; i < tokens.length - 1; i++) {
        const pair = `${tokens[i]} ${tokens[i+1]}`;
        totalPairs++;
        uniquePairs.add(pair);
    }
    
    if (totalPairs === 0) return 0.0;
    return uniquePairs.size / totalPairs;
}
