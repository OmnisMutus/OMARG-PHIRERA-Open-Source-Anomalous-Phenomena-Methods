#!/usr/bin/env python3
"""
omarg_terminal.py

The Command-Line Observatory for the Recursive Symbolics Framework.
Follows the identical 6-step ritual arc as the Web UI:
Invocation -> Unfolding -> Climax -> Threshold -> Acknowledgment -> Integration.
"""

import sys
import os
import time
import urllib.request
import urllib.error
import json

# Ensure we can import from tools
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'tools')))

try:
    from symbolic_debugger import analyze
    from sephirotic_sorting import (
        build_list, iter_linked, insertion_sort, selection_sort, quick_sort, merge_sort
    )
except ImportError as e:
    print(f"Error importing framework tools: {e}")
    sys.exit(1)

ALGO_MAP = {
    "Hod": (insertion_sort, "Insertion Sort"),
    "Geburah": (selection_sort, "Selection Sort"),
    "Chokmah": (quick_sort, "Quick Sort"),
    "Tiphareth": (merge_sort, "Merge Sort"),
    "Chesed": (merge_sort, "Merge Sort"),
    "Netzach": (insertion_sort, "Insertion Sort"),
    "Yesod": (quick_sort, "Quick Sort"),
    "Binah": (selection_sort, "Selection Sort"),
    "Kether": (merge_sort, "Merge Sort"),
    "Malkuth": (insertion_sort, "Insertion Sort"),
    "Daath": (merge_sort, "Merge Sort")
}

def string_to_chaotic_array(text):
    """Deterministic hash to generate Tohu from input text."""
    arr = []
    for i, c in enumerate(text):
        scrambled = (ord(c) * 31 + i * 17) % 100
        arr.append(scrambled)
    while len(arr) < 12:
        last = arr[-1] if arr else 42
        arr.append((last * 7 + 13) % 100)
    return arr

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def main():
    clear_screen()
    print("==================================================")
    print("                OMARG OBSERVATORY                 ")
    print("               The Mirror of Tikun                ")
    print("==================================================\n")

    # 1. INVOCATION
    print("--- 1. INVOCATION ---")
    print("Describe your current state. (e.g. 'I feel rigid and stuck' or 'I am overwhelmed')")
    state_input = input("> ").strip()
    
    if not state_input:
        print("Empty state. Ritual aborted.")
        return

    # Deterministic Tohu
    tohu_array = string_to_chaotic_array(state_input)
    
    # Diagnosis
    analysis = analyze(state_input)
    sephira = analysis.get("dominant") or "Daath"
    entropy = analysis.get("entropy", 0.0)
    
    sort_fn, algo_name = ALGO_MAP.get(sephira, (merge_sort, "Merge Sort"))

    print("\n--- 2. UNFOLDING ---")
    
    import random
    caveats = [
        "This is a snapshot, not a score.",
        "Measures coherence, not correctness.",
        "Pattern detection, not diagnosis."
    ]
    caveat = random.choice(caveats)
    print(f"H_s (Entropy): {entropy:.2f} | {caveat}")
    print(f"Diagnosis: {sephira}")
    print(f"Algorithm: {algo_name}")
    print(f"Tohu (Chaos): {tohu_array}")
    
    # Simulate processing time for the ritual
    print("\nInitiating Tikun...")
    time.sleep(1)
    
    # Since the linked list sort doesn't yield frame-by-frame, we simulate the visualization of work
    for i in range(3):
        print(f"  Swapping nodes... [Iteration {i+1}]")
        time.sleep(0.5)

    head = build_list(tohu_array)
    sorted_head = sort_fn(head)
    sorted_array = [node.val for node in iter_linked(sorted_head)]

    # 3. CLIMAX
    print("\n--- 3. CLIMAX ---")
    print(f"Tikun (Order): {sorted_array}")
    time.sleep(1)

    # 4. THRESHOLD
    print("\n==================================================")
    print("              POETICS, NOT PHYSICS                ")
    print("==================================================")
    print("The sorting ritual you just witnessed is a symbolic")
    print("mirror generated deterministically from your words.")
    print(f"The system diagnosed a dominant resonance of {sephira.upper()}.")
    print("\nThis is a mirror, not a model.")
    print("The pattern is yours to interpret.")
    print("==================================================\n")

    # 5. ACKNOWLEDGMENT
    while True:
        ack = input("Type 'I See the Mirror' to close the ritual: ").strip()
        if ack.lower() == "i see the mirror":
            break

    # 6. INTEGRATION (Telemetry)
    print("\n--- 6. INTEGRATION ---")
    print("Logging to Telemetry Bridge...")
    
    telemetry_data = {
        "event": "ritual_complete",
        "sephira": sephira,
        "algorithm": algo_name,
        "array_size": len(tohu_array),
        "source": "omarg_terminal"
    }

    try:
        req = urllib.request.Request(
            'http://localhost:5001/log',
            data=json.dumps(telemetry_data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req, timeout=3) as response:
            if response.status == 200:
                print("Integration successful. The observatory has recorded the event.")
            else:
                print("Integration failed. Telemetry bridge refused.")
    except urllib.error.URLError:
        # Note: If the microservice isn't running, we fail gracefully.
        print("Integration skipped. Telemetry bridge (localhost:5001) not reachable.")
        
    print("\nRitual complete. State cleared.")

if __name__ == "__main__":
    main()
