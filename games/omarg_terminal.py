#!/usr/bin/env python3
"""
omarg_terminal.py
A continuous shell interface for the OMARG framework.
Users can submit their emotional states via /sort-state to receive a
metaphorical sorting ritual, logging the entropy to the global observatory.
"""

import sys
import time
import random
import hashlib
import pathlib
import json
from datetime import datetime
import pathlib
import json

# Add tools to path to import the debugger and sorting API
sys.path.append(str(pathlib.Path(__file__).parent.parent / "tools"))
try:
    import symbolic_debugger
    import sephirotic_sorting
    from telemetry_analyzer import calc_symbolic_entropy
except ImportError as e:
    print(f"FATAL: Missing dependencies. Check directory structure. Error: {e}")
    sys.exit(1)

def print_slow(text, delay=0.015):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def get_keywords_for_sephira(sephira):
    """Retrieve keywords for the poetic echo."""
    try:
        api = json.load(open(pathlib.Path(__file__).parent.parent / "tools" / "symbolic_api.json", "r", encoding="utf-8"))
        keywords = api.get("sephirot", {}).get(sephira, {}).get("keywords", [])
        return keywords[:3] if keywords else [sephira]
    except Exception:
        return [sephira]

def log_telemetry(entry):
    log_path = pathlib.Path(__file__).parent.parent / "tools" / "community_dataset.jsonl"
    with open(log_path, "a") as f:
        f.write(json.dumps(entry) + "\n")

def handle_sort_state(user_input):
    if not user_input:
        print("Usage: /sort-state <your emotional description>")
        return

    print_slow("\n[SYS] Transmitting state to the Observatory...")
    time.sleep(0.5)

    # 1. Diagnosis
    analysis = symbolic_debugger.analyze(user_input)
    dom_sephira = analysis.get("dominant")
    
    if dom_sephira:
        keywords = get_keywords_for_sephira(dom_sephira)
        echo = f'"{dom_sephira}" detected: ' + ", ".join(f'"{k}"' for k in keywords)
    else:
        dom_sephira = "Tifereth" # Fallback integrative neutral
        echo = '"Unknown state" detected. Defaulting to integrative neutral (Tifereth).'

    print(f"[DIAGNOSIS] {echo}")

    # 2. Map Algorithm
    algo_map = {
        "Hod": (sephirotic_sorting.insertion_sort, "insertion_sort"),
        "Geburah": (sephirotic_sorting.selection_sort, "selection_sort"),
        "Chokmah": (sephirotic_sorting.quick_sort, "quick_sort"),
        "Tifereth": (sephirotic_sorting.merge_sort, "merge_sort"),
        "Netzach": (sephirotic_sorting.merge_sort, "merge_sort") # Fallback to Tifereth for missing ones
    }
    
    sort_fn, algo_name = algo_map.get(dom_sephira, (sephirotic_sorting.merge_sort, "merge_sort"))

    # 3. Generate Tohu (Chaos) from user hash
    random.seed(user_input)
    vals = [random.randint(1, 99) for _ in range(12)]
    print(f"[ORIGINAL CHAOS] {vals}")
    
    # 4. Ritual Sort
    print_slow(f"[RITUAL] Invoking {dom_sephira} protocol ({algo_name})...")
    head = sephirotic_sorting.build_list(vals)
    
    start_time = time.perf_counter()
    sorted_head = sort_fn(head)
    sort_duration = time.perf_counter() - start_time
    
    sorted_vals = [node.val for node in sephirotic_sorting.iter_linked(sorted_head)]
    print(f"[TIKUN] {sorted_vals}")
    
    # 5. Ethical Disclaimer
    print("\n[!] ETHICAL API CAVEAT: This is a symbolic mirror; the territory is your lived experience.")
    print("[!] You are not being 'fixed'—you are being shown your own recursive patterns.")
    print("[!] There are no optimal algorithms for consciousness. We celebrate all speeds.\n")

    # 6. Telemetry Logging
    entropy_initial = calc_symbolic_entropy(user_input)
    # The sorted state (strictly ordered) has entropy of 0.0 mathematically compared to the raw string
    entropy_reduction = entropy_initial - 0.0 
    
    entry = {
        "timestamp": datetime.now().isoformat(),
        "user_id_hash": hashlib.sha256(b"local_terminal_user").hexdigest()[:12],
        "event": "sephirotic_sort_ritual",
        "algorithm": algo_name,
        "sephira": dom_sephira,
        "input_entropy": round(entropy_initial, 3),
        "entropy_reduction": round(entropy_reduction, 3),
        "sorting_time": round(sort_duration, 6),
        "output": sorted_vals
    }
    log_telemetry(entry)

def main():
    print_slow("INITIALIZING OMARG-PHIRERA MIRROR PROTOCOL...")
    print("Welcome to the interactive terminal.")
    print("Available commands:")
    print("  /sort-state <your current emotional state>")
    print("  /exit")
    print("-" * 50)
    
    while True:
        try:
            cmd_line = input("\nOMARG_SYS> ").strip()
        except (KeyboardInterrupt, EOFError):
            break
            
        if not cmd_line:
            continue
            
        parts = cmd_line.split(" ", 1)
        command = parts[0].lower()
        args = parts[1] if len(parts) > 1 else ""
        
        if command in ["/exit", "/quit", "exit", "quit"]:
            print_slow("Terminating connection. Stay safe.")
            break
        elif command == "/sort-state":
            handle_sort_state(args)
        else:
            print(f"[X] COMMAND NOT RECOGNIZED: {command}")

if __name__ == "__main__":
    main()
