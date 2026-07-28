const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// We use dynamic import for the ES module since this is a commonjs script
async function runValidation() {
    console.log("Initializing Cross-Validation Test...");
    
    // Load the JS debugger
    const { diagnoseSephira } = await import('../src/lib/symbolicDebugger.js');
    
    // Load the API to get keywords
    const apiPath = path.join(__dirname, '..', 'src', 'lib', 'symbolic_api.json');
    const api = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
    
    let allKeywords = [];
    for (const [seph, data] of Object.entries(api.sephirot)) {
        allKeywords.push(...data.keywords);
    }
    
    // Generate 100 random phrases
    const phrases = [];
    for (let i = 0; i < 100; i++) {
        let phrase = "I feel ";
        // Pick 1 to 5 random keywords
        const numWords = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < numWords; j++) {
            phrase += allKeywords[Math.floor(Math.random() * allKeywords.length)] + " ";
        }
        phrases.push(phrase.trim());
    }
    
    // Some edge cases
    phrases.push("completely scattered and overwhelmed");
    phrases.push("rigid angry harsh stuck");
    phrases.push("no keywords here just normal text");
    phrases.push("SPLIT split split decision decision decision");
    
    let passed = 0;
    let failed = 0;
    
    const pyScript = path.join(__dirname, '..', '..', 'tools', 'symbolic_debugger.py');
    
    console.log(`Running ${phrases.length} phrases through Python and JS engines...`);
    
    for (const phrase of phrases) {
        // Run JS
        const jsResult = diagnoseSephira(phrase) || "None";
        
        // Run Python
        // We grep the dominant sephira from the CLI output
        // Example output line: "Dominant Sephirah : Geburah"
        try {
            const pyOutput = execSync(`python "${pyScript}" "${phrase}"`, { env: { ...process.env, PYTHONIOENCODING: 'utf-8' } }).toString();
            let pyResult = "None";
            const match = pyOutput.match(/Dominant Sephirah\s*:\s*(\w+)/);
            if (match) {
                pyResult = match[1];
            } else if (pyOutput.includes("No recognizable symbolic keywords found")) {
                pyResult = "None";
            }
            
            if (jsResult === pyResult) {
                passed++;
            } else {
                console.error(`\n[!] ISOMORPHISM FAILURE`);
                console.error(`Phrase : "${phrase}"`);
                console.error(`Python : ${pyResult}`);
                console.error(`JS     : ${jsResult}`);
                failed++;
            }
        } catch (e) {
            console.error(`Error running python for phrase: ${phrase}`);
            failed++;
        }
    }
    
    console.log(`\n--- Cross-Validation Results ---`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    
    if (failed === 0) {
        console.log(`\n[SUCCESS] 100% Isomorphism Verified.`);
        process.exit(0);
    } else {
        console.log(`\n[ERROR] Divergence detected. The framework is compromised.`);
        process.exit(1);
    }
}

runValidation();
