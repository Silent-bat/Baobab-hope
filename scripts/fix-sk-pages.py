#!/usr/bin/env python3
"""
Script spécialisé pour corriger le fichier sk/pages.json
"""
import json
import re

def fix_sk_pages():
    """Corrige le fichier sk/pages.json"""
    filepath = "public/locales/sk/pages.json"

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        print(f"🔧 Processing {filepath}...")

        # Extract all key-value pairs using regex
        # This pattern matches "key": "value" pairs
        pattern = r'"([^"]+)"\s*:\s*"([^"]*)"'
        matches = re.findall(pattern, content)

        # Create a proper JSON structure
        json_structure = {}

        # Create a simple structure with all the content
        for i in range(0, len(matches), 2):
            if i + 1 < len(matches):
                key = matches[i]
                value = matches[i + 1]
                json_structure[key] = value

        # Write the corrected JSON
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(json_structure, f, ensure_ascii=False, indent=2)

        print(f"✅ {filepath}: Fixed successfully")

    except Exception as e:
        print(f"❌ {filepath}: Error - {str(e)}")

if __name__ == "__main__":
    fix_sk_pages()