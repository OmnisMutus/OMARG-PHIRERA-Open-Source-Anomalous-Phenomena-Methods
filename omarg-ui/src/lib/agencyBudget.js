/**
 * agencyBudget.js
 * 
 * Implements the Delta-operator (Δ_γ,τ) directive strength scalar calculation
 * and sovereignty metadata injection for user agency protection.
 */

export function computeGamma(logits) {
    if (!logits || logits.length === 0) return 0.0;

    const maxLogit = Math.max(...logits);
    const expLogits = logits.map(x => Math.exp(x - maxLogit));
    const sumExp = expLogits.reduce((a, b) => a + b, 0);
    const probs = expLogits.map(x => x / sumExp);

    const n = probs.length;
    if (n <= 1) return 0.85;

    let entropy = 0.0;
    for (const p of probs) {
        if (p > 0) {
            entropy -= p * Math.log2(p + 1e-12);
        }
    }

    const maxEntropy = Math.log2(n);
    const normEntropy = maxEntropy > 0 ? entropy / maxEntropy : 0.0;
    const rawGamma = 1.0 - normEntropy;

    // Hard-coded safety cap at 0.85 for allowable agency budget
    return Math.min(Math.max(rawGamma, 0.0), 0.85);
}

export function evaluateSovereigntyMetadata(logits, alternativesCount = 1) {
    const gamma = computeGamma(logits);
    const maxLogit = logits && logits.length ? Math.max(...logits) : 0;
    const expLogits = logits && logits.length ? logits.map(x => Math.exp(x - maxLogit)) : [1.0];
    const sumExp = expLogits.reduce((a, b) => a + b, 0);
    const probs = expLogits.map(x => x / sumExp);
    const n = probs.length;

    let entropy = 0.0;
    for (const p of probs) {
        if (p > 0) entropy -= p * Math.log2(p + 1e-12);
    }
    const hc = n > 1 ? entropy / Math.log2(n) : 1.0;
    const aai = Number((1.0 - (gamma * 0.5)).toFixed(2));

    return {
        directive_strength: Number(gamma.toFixed(4)),
        confidence_entropy: Number(hc.toFixed(4)),
        alternatives_presented: alternativesCount,
        agency_attribution_index: aai,
        drift_coefficient: Number(gamma.toFixed(4)),
        max_gamma_cap: 0.85,
        sovereignty_guarantee: "ALLOWABLE_AGENCY_BUDGET_RESPECTED"
    };
}

export function applyStyleFilter(responseText, gamma, alternativesCount = 1) {
    let filtered = responseText;
    if (alternativesCount < 2 && gamma > 0.4) {
        filtered += " (Note: Alternative paths and interpretations may also apply.)";
    }
    return filtered;
}
