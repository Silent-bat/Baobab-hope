#!/usr/bin/env python3
"""
Script ultra-spécialisé pour corriger les 3 derniers fichiers JSON problématiques
"""
import json
import os
import re
from pathlib import Path

def fix_specific_files():
    """Corrige les fichiers spécifiques qui posent encore problème"""

    # Liste des fichiers problématiques identifiés
    problematic_files = [
        "public/locales/sk/common.json",
        "public/locales/sk/manifest.json",
        "public/locales/sk/pages.json"
    ]

    for filepath in problematic_files:
        if not os.path.exists(filepath):
            print(f"⚠️  {filepath}: File not found")
            continue

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            print(f"🔧 Processing {filepath}...")

            # Strategy 1: Try to extract valid JSON structure
            try:
                # Look for the main object structure
                start_match = content.find('{')
                end_match = content.rfind('}')

                if start_match != -1 and end_match != -1 and end_match > start_match:
                    json_part = content[start_match:end_match + 1]

                    # Clean up the JSON part
                    json_part = re.sub(r',(\s*[}\]])', r'\1', json_part)  # Remove trailing commas
                    json_part = re.sub(r'{\s*,', '{', json_part)  # Remove leading commas

                    # Try to parse
                    parsed = json.loads(json_part)

                    # Write back the properly formatted JSON
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(parsed, f, ensure_ascii=False, indent=2)

                    print(f"✅ {filepath}: Fixed successfully")
                else:
                    print(f"❌ {filepath}: Could not find valid JSON structure")

            except json.JSONDecodeError as e:
                print(f"❌ {filepath}: Could not fix - {str(e)}")

        except Exception as e:
            print(f"❌ {filepath}: Error reading file - {str(e)}")

def main():
    """Fonction principale"""
    print("🔧 Processing the last problematic files...")
    fix_specific_files()

    print("\n📊 Manual verification needed:")
    print("Please check the following files manually if they still have issues:")
    print("- public/locales/sk/common.json")
    print("- public/locales/sk/manifest.json")
    print("- public/locales/sk/pages.json")

if __name__ == "__main__":
    main()