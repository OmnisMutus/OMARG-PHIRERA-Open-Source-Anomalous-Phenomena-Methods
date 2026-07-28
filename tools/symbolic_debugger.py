#!/usr/bin/env python3  
"""  
symbolic_debugger.py  
A lightweight CLI that analyses free-text input, detects dominant  
Sephirotic signatures, and proposes a balancing operator.

Usage:  
    python symbolic_debugger.py "I feel stuck in analysis, my mind loops."  
"""

import json, sys, re, collections, pathlib

API_PATH = pathlib.Path(__file__).parent / "symbolic_api.json"  
API = json.load(open(API_PATH, "r", encoding="utf-8"))

# ----------------------------------------------------------------------  
# Helper: flatten keyword → sephira map  
keyword_map = {}  
for seph, data in API["sephirot"].items():  
    for kw in data["keywords"]:  
        keyword_map[kw.lower()] = seph

def tokenize(text):  
    # very simple word tokenizer – enough for a demo  
    return re.findall(r"\b\w+\b", text.lower())

def detect_counts(tokens):  
    counts = collections.Counter()  
    for t in tokens:  
        if t in keyword_map:  
            counts[keyword_map[t]] += 1  
    return counts

def dominant_sephira(counts):  
    if not counts:  
        return None  
    return counts.most_common(1)[0][0]

def suggest_balance(seph):  
    rules = API["balancing_rules"]  
    return rules.get(seph, None)

def analyze(text):
    """
    Module entry point for analyzing text.
    Returns a dict with 'dominant' and 'suggestion'.
    """
    tokens = tokenize(text)
    counts = detect_counts(tokens)
    if not counts:
        return {"dominant": None, "suggestion": None}
    
    dom = dominant_sephira(counts)
    bal = suggest_balance(dom)
    return {"dominant": dom, "suggestion": bal}

def main():  
    if len(sys.argv) < 2:  
        print("Usage: python symbolic_debugger.py \"<text>\"")  
        sys.exit(1)

    raw = " ".join(sys.argv[1:])  
    tokens = tokenize(raw)  
    counts = detect_counts(tokens)

    if not counts:  
        print("No recognizable symbolic keywords found.")  
        sys.exit(0)

    dom = dominant_sephira(counts)  
    bal = suggest_balance(dom)

    print("\n--- Symbolic Debugger Report ---")  
    print(f"Input text   : {raw}")  
    print(f"Detected signatures:")  
    for s, c in counts.most_common():  
        print(f"  {s:10s} → {c} hit(s)")

    print(f"\nDominant Sephirah : {dom}")  
    if bal:  
        print(f"Recommended balancing operator : {bal}")  
        # Show a one-liner suggestion  
        print(f"Suggested patch: invoke {bal} on the current state.")  
    else:  
        print("No balancing rule defined for this Sephirah.")

    print("\nTip: To improve detection, add more keywords to symbolic_api.json → sephirot → <name> → keywords.\n")

if __name__ == "__main__":  
    main()  
