#!/usr/bin/env python3
"""
simulate_telemetry.py
Simulates multiple practitioners submitting data to the feedback ingester
to verify the collective telemetry pipeline.
"""

import subprocess
import time
import json
import pathlib

# Some fake debugger outputs representing different users and states
FAKE_LOGS = [
    ("user1_debugger.md", "I am overthinking everything. My mind is stuck on small details.\nDominant: Hod\nSuggested patch: invoke Netzach on the current state."),
    ("user2_debugger.md", "I feel too aggressive, cutting people off in meetings.\nDominant: Geburah\nSuggested patch: invoke Chesed on the current state."),
    ("user3_ritual.md", "# Ritual Compilation - Resolve Grief\nTarget: P24\nPath24(state) => resetState(state)"),
    ("user4_debugger.md", "I'm lost in abstract daydreams, completely ungrounded.\nDominant: Chesed\nSuggested patch: invoke Geburah on the current state."),
    ("user5_ritual.md", "# User: Alice@example.com\n# Ritual Compilation - Launch Project\nTarget: P14\nPath14(state) => buildStructure(state)")
]

def main():
    tools_dir = pathlib.Path(__file__).parent
    
    print("--- Simulating Collective Telemetry Pipeline ---")
    
    for filename, content in FAKE_LOGS:
        filepath = tools_dir / filename
        # Write fake log
        filepath.write_text(content, encoding='utf-8')
        
        # Run ingester
        print(f"Ingesting {filename}...")
        subprocess.run(["python", "feedback_ingester.py", filename], cwd=tools_dir, check=True)
        
        # Cleanup fake log
        filepath.unlink()
        
    print("\n--- Pipeline Simulation Complete ---")
    
    # Read back the dataset to verify
    dataset_path = tools_dir / "community_dataset.jsonl"
    print(f"\nVerifying {dataset_path.name}:")
    
    count = 0
    with open(dataset_path, 'r', encoding='utf-8') as f:
        for line in f:
            count += 1
            data = json.loads(line)
            # Print a summary of the ingested row
            print(f"Row {count} | User Hash: {data.get('user_id_hash')} | Source: {data.get('source')} | Dominant: {data.get('dominant_sephirah')} | Patch: {data.get('patch')}")

if __name__ == "__main__":
    main()
