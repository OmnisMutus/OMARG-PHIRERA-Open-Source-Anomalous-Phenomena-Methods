import math
import lookup

def compute_gamma(logits):
    """
    Computes directive strength gamma (0.0 to 1.0) from candidate action logits.
    """
    if not logits:
        return 0.0
    
    max_logit = max(logits)
    exp_logits = [math.exp(x - max_logit) for x in logits]
    sum_exp = sum(exp_logits)
    probs = [x / sum_exp for x in exp_logits]
    
    n = len(probs)
    if n <= 1:
        return 0.85
    
    entropy = -sum(p * math.log2(p + 1e-12) for p in probs if p > 0)
    max_entropy = math.log2(n)
    
    norm_entropy = entropy / max_entropy if max_entropy > 0 else 0.0
    raw_gamma = 1.0 - norm_entropy
    
    return min(max(raw_gamma, 0.0), 0.85)

def enrich_response(content, logits, alternatives=1, confidence_entropy=0.0, agency_attribution_index=0.5, post_dialogue_score=None):
    """
    Enriches response payload with sovereignty metadata (Delta-operator gamma).
    """
    gamma = compute_gamma(logits)
    
    sovereignty_metadata = {
        "directive_strength": gamma,
        "confidence_entropy": confidence_entropy,
        "alternatives_presented": alternatives,
        "agency_attribution_index": agency_attribution_index,
        "drift_coefficient": gamma,
        "post_dialogue_score": post_dialogue_score,
        "max_gamma_cap": 0.85,
        "sovereignty_guarantee": "ALLOWABLE_AGENCY_BUDGET_RESPECTED"
    }
    
    return {
        "content": content,
        "sovereignty_metadata": sovereignty_metadata
    }

def lookup_qabalah(letter: str) -> dict:
    """
    Returns the full Hermetic Qabalah cipher row for a Hebrew character.
    """
    return lookup.lookup(letter)

if __name__ == "__main__":
    test_logits = [2.0, 1.0, 0.5]
    print("Enriched Response Test:")
    print(enrich_response("Demo", test_logits))
    print("Qabalah Lookup Test (Shin):")
    print(lookup_qabalah("ש"))
