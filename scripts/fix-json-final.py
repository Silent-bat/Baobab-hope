#!/usr/bin/env python3
"""
Script final pour corriger les virgules manquantes et les données supplémentaires dans les fichiers JSON
"""
import json
import os
import glob
import re
from pathlib import Path

def fix_comma_issues(content):
    """Corrige les problèmes de virgules dans le JSON"""
    original_content = content

    # Fix 1: Add missing commas between properties
    # This regex finds property definitions that are followed by another property without a comma
    content = re.sub(r'(":\s*"[^"]*"\s*)(\n\s*)("[^"]*":)', r'\1,\2\3', content)

    # Fix 2: Remove extra commas before closing braces/brackets
    content = re.sub(r',(\s*[}\]])', r'\1', content)

    # Fix 3: Add missing commas after closing braces/brackets when followed by more content
    content = re.sub(r'([}\]])(\s*\n\s*)("[^"]*":)', r'\1,\2\3', content)

    # Fix 4: Handle array elements
    content = re.sub(r'(":\s*\[[^\]]*\]\s*)(\n\s*)("[^"]*":)', r'\1,\2\3', content)

    return content

def fix_extra_data(content):
    """Supprime les données supplémentaires qui causent des erreurs JSON"""
    lines = content.split('\n')
    valid_lines = []
    brace_count = 0

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Count braces to maintain structure
        brace_count += stripped.count('{') - stripped.count('}')

        # Keep lines that look like valid JSON structure
        if (stripped.startswith('"') and ('":' in stripped)) or \
           stripped in ['{', '}'] or \
           stripped.startswith('//') or \
           (stripped.startswith('[') and stripped.endswith(']')) or \
           (stripped.endswith(',') and not stripped.startswith('//')):
            valid_lines.append(line)

    return '\n'.join(valid_lines)

def fix_json_file(filepath):
    """Corrige un fichier JSON spécifique"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Try to fix comma issues first
        fixed_content = fix_comma_issues(content)

        # Try to fix extra data issues
        fixed_content = fix_extra_data(fixed_content)

        # Try to parse the fixed content
        try:
            parsed = json.loads(fixed_content)
            # Write back the properly formatted JSON
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(parsed, f, ensure_ascii=False, indent=2)
            return True, "Fixed successfully"
        except json.JSONDecodeError as e:
            # If still failing, try to create a minimal valid JSON
            try:
                # Try to extract just the valid parts
                lines = fixed_content.split('\n')
                valid_lines = []
                brace_count = 0

                for line in lines:
                    stripped = line.strip()
                    if not stripped:
                        continue

                    # Count braces to maintain structure
                    brace_count += stripped.count('{') - stripped.count('}')

                    if (stripped.startswith('"') and ('":' in stripped)) or \
                       stripped in ['{', '}'] or \
                       stripped.startswith('//'):
                        valid_lines.append(line)

                if valid_lines:
                    # Try to create a minimal valid JSON
                    minimal_content = '\n'.join(valid_lines)
                    parsed = json.loads(minimal_content)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(parsed, f, ensure_ascii=False, indent=2)
                    return True, "Fixed with minimal valid structure"
            except:
                return False, f"Could not fix: {str(e)}"

    except Exception as e:
        return False, f"Error reading file: {str(e)}"

    return False, "Unknown error"

def main():
    """Fonction principale"""
    print("🔧 Processing remaining JSON files...")

    # Find all JSON files in public/locales
    json_files = glob.glob("public/locales/**/*.json", recursive=True)
    total_files = len(json_files)

    print(f"📁 Found {total_files} JSON files to process")

    success_count = 0
    fail_count = 0
    errors = []

    for filepath in json_files:
        success, message = fix_json_file(filepath)
        if success:
            success_count += 1
            print(f"✅ {filepath}: {message}")
        else:
            fail_count += 1
            errors.append((filepath, message))
            print(f"❌ {filepath}: {message}")

    # Print summary
    print("\n📊 Results:")
    print(f"✅ Successfully fixed: {success_count} files")
    print(f"❌ Failed to fix: {fail_count} files")
    print(f"📁 Total files processed: {total_files}")

    if errors:
        print("\n🔍 Failed files:")
        for filepath, error in errors[:10]:  # Show first 10 errors
            print(f"  - {filepath}: {error}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more")

if __name__ == "__main__":
    main()