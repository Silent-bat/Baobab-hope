#!/usr/bin/env python3
"""
Script complet pour corriger tous les problèmes JSON dans les fichiers de traduction
"""
import json
import os
import glob
import re
from pathlib import Path

def fix_json_syntax(content):
    """Corrige les problèmes de syntaxe JSON courants"""
    original_content = content

    # Fix 1: Remove trailing commas before closing braces/brackets
    content = re.sub(r',(\s*[}\]])', r'\1', content)

    # Fix 2: Add missing commas between properties
    # This is more complex - we need to be careful not to add commas where they shouldn't be
    lines = content.split('\n')
    fixed_lines = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        if (stripped.endswith('"') or stripped.endswith("'")) and i < len(lines) - 1:
            next_line = lines[i + 1].strip() if i + 1 < len(lines) else ""
            if next_line.startswith('"') or next_line.startswith("'"):
                # Check if the next line is not a closing brace/bracket
                if not (next_line.startswith('}') or next_line.startswith(']') or next_line.startswith(',')):
                    fixed_lines.append(line + ',')
                    continue
        fixed_lines.append(line)

    content = '\n'.join(fixed_lines)

    # Fix 3: Handle empty objects that might have syntax issues
    content = re.sub(r'{\s*,?\s*}', '{}', content)

    # Fix 4: Remove extra commas at the beginning of objects
    content = re.sub(r'{\s*,', '{', content)

    # Fix 5: Remove extra closing braces
    content = re.sub(r'}(\s*})+', '}', content)

    return content

def fix_json_file(filepath):
    """Corrige un fichier JSON spécifique"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Try to fix common syntax issues
        fixed_content = fix_json_syntax(content)

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
    print("🔧 Processing JSON files comprehensively...")

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