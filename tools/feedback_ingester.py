#!/usr/bin/env python3
"""
feedback_ingester.py
Anonymizes ritual and debugger outputs to a shared dataset, 
enabling the system to learn and refine its rules from collective practice.

Usage (CLI):
    python feedback_ingester.py path/to/ritual_output.md

Usage (Module):
    from feedback_ingester import ingest_feedback
    ingest_feedback(raw_text_content, source_type="ritual")
"""

import sys
import json
import re
import pathlib
import datetime

DATASET_PATH = pathlib.Path(__file__).parent / "community_dataset.jsonl"

def scrub_pii(text):
    """
    Very basic heuristic PII scrubber. 
    Removes things that look like emails, phone numbers, or standard names.
    In a production system, use a dedicated NLP library like Presidio.
    """
    # Remove emails
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b', '[EMAIL_REDACTED]', text)
    # Remove simple phone number patterns
    text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[PHONE_REDACTED]', text)
    # Remove IP addresses
    text = re.sub(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', '[IP_REDACTED]', text)
    
    return text

def ingest_feedback(content, source_type="unknown"):
    """
    Scrubs content and appends it to the JSONL dataset.
    """
    scrubbed_content = scrub_pii(content)
    
    payload = {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "source": source_type,
        "content_length": len(scrubbed_content),
        "data": scrubbed_content
    }
    
    with open(DATASET_PATH, 'a', encoding='utf-8') as f:
        f.write(json.dumps(payload) + "\n")
        
    return payload

def main():
    if len(sys.argv) < 2:
        print("Usage: python feedback_ingester.py <path_to_file>")
        sys.exit(1)
        
    file_path = pathlib.Path(sys.argv[1])
    if not file_path.exists():
        print(f"Error: File {file_path} not found.")
        sys.exit(1)
        
    raw_content = file_path.read_text(encoding='utf-8')
    source = "ritual_compiler" if "ritual" in file_path.name.lower() else "debugger"
    
    ingest_feedback(raw_content, source_type=source)
    print(f"Successfully scrubbed and ingested {file_path.name} into {DATASET_PATH.name}")

if __name__ == "__main__":
    main()
