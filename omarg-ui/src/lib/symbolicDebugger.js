/**
 * symbolicDebugger.js
 * 
 * Ports the Python logic for text hashing and Sephira diagnosis into JS.
 */

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
    
    // Cap at 20 elements for animation sanity
    arr = arr.slice(0, 20);
    
    // Convert to objects with unique IDs for React rendering
    return arr.map((val, idx) => ({ id: `node-${idx}-${val}`, value: val }));
}

// Scans text for keywords to determine the dominant Sephira
export function diagnoseSephira(text) {
    const lowerText = text.toLowerCase();
    
    const keywords = {
        "Hod": ["scattered", "confused", "details", "overwhelmed", "anxious", "lost"],
        "Geburah": ["rigid", "angry", "harsh", "stuck", "judgment", "cut", "worst"],
        "Chokmah": ["split", "binary", "decision", "choice", "paralyzed", "pivot"],
        "Tifereth": ["broken", "conflict", "balance", "torn", "heal", "peace"]
    };
    
    let scores = { "Hod": 0, "Geburah": 0, "Chokmah": 0, "Tifereth": 0 };
    
    for (const [sephira, words] of Object.entries(keywords)) {
        for (const word of words) {
            if (lowerText.includes(word)) {
                scores[sephira] += 1;
            }
        }
    }
    
    // Find highest score
    let highest = 0;
    let selected = "Tifereth"; // Default fallback
    
    for (const [sephira, score] of Object.entries(scores)) {
        if (score > highest) {
            highest = score;
            selected = sephira;
        }
    }
    
    return selected;
}
