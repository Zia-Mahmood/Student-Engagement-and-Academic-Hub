import json
from typing import List, Dict

def load_jsonl(jsonl_file: str) -> List[Dict]:
    """Load a newline‑delimited JSONL file into a list of dicts."""
    documents = []
    with open(jsonl_file, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                doc = json.loads(line)
                documents.append(doc)
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON: {e}")
    return documents
