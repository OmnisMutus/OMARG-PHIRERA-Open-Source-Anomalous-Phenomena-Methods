#!/usr/bin/env python3
"""
omarg_terminal.py
A Cicada-style terminal ARG prototype.
Simulates a corrupted OMARG log and challenges the player to provide the balancing operator.
"""

import sys
import time
import random
import hashlib
import pathlib

# Add tools to path to import the debugger
sys.path.append(str(pathlib.Path(__file__).parent.parent / "tools"))
try:
    import symbolic_debugger
except ImportError:
    print("FATAL: symbolic_debugger module not found. Check directory structure.")
    sys.exit(1)

CORRUPTED_LOG = """
[LOG_START]
I am stuck in endless logic loops. 
Every detail must be categorized. I cannot stop the distillation.
Analysis paralysis is setting in. Need to refine the data.
Error code 0xDEAD: Recursive Hod-loop detected.
[LOG_END]
"""

def simulate_corruption(text):
    lines = text.strip().split('\n')
    corrupted = []
    for line in lines:
        if line.startswith("[") or "0xDEAD" in line:
            corrupted.append(line)
            continue
        
        # Scramble a few characters
        chars = list(line)
        for _ in range(len(chars) // 4):
            idx = random.randint(0, len(chars)-1)
            chars[idx] = random.choice(['#', '@', '%', '&', '?', '*'])
        corrupted.append("".join(chars))
        
    return "\n".join(corrupted)

def print_slow(text, delay=0.02):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def main():
    print_slow("INITIALIZING OMARG-PHIRERA ARCHIVE...")
    time.sleep(0.5)
    print_slow("WARNING: DATA CORRUPTION DETECTED IN SECTOR 7.")
    time.sleep(0.5)
    
    # Use the debugger to analyze the raw log to determine the win condition dynamically
    analysis = symbolic_debugger.analyze(CORRUPTED_LOG)
    target_solution = analysis.get("suggestion", "")
    
    if not target_solution:
        print("SYSTEM ERROR: No solution mapped. Check symbolic_api.json.")
        sys.exit(1)
        
    print("\n--- RECOVERED FRAGMENT ---")
    print(simulate_corruption(CORRUPTED_LOG))
    print("--------------------------\n")
    
    print_slow("SYSTEM HALTED. REQUIRES MANUAL BALANCING PATCH TO CONTINUE.")
    
    attempts = 0
    max_attempts = 3
    
    while attempts < max_attempts:
        cmd = input("OMARG_SYS> ").strip().lower()
        
        if cmd == "hint":
            print(f"HINT: Initiate balancing protocol '{target_solution[:3].upper()}...'")
            continue
            
        if cmd == target_solution.lower():
            print_slow("\n[✓] PATCH ACCEPTED. DECRYPTING NEXT LOG...")
            time.sleep(1)
            print_slow("Just kidding, this is the end of Prototype 1. Well done, agent.")
            sys.exit(0)
        else:
            attempts += 1
            print(f"[X] COMMAND NOT RECOGNIZED. {max_attempts - attempts} ATTEMPTS REMAINING.")
            
    # Lockout condition
    print_slow("\n[!] MAXIMUM FAILURES EXCEEDED. SYSTEM LOCKDOWN INITIATED.")
    lockout_hash = hashlib.sha256("OMARG_LOCKOUT_CODE_42".encode()).hexdigest()
    print_slow(f"FATAL EXCEPTION. HASH: {lockout_hash}")
    sys.exit(1)

if __name__ == "__main__":
    main()
