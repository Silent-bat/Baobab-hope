#!/usr/bin/env python3
import json
import os
import glob

def fix_json_file(filepath):
    """Fix common JSON issues in a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Try to parse as JSON to identify issues
        try:
            json.loads(content)
            return True  # File is already valid
        except json.JSONDecodeError as e:
            print(f"Error in {filepath}: {e}")

            # Common fixes
            if "Expecting ',' delimiter" in str(e) or "Expecting ':'" in str(e):
                # Try to fix trailing commas and missing commas
                lines = content.split('\n')
                fixed_lines = []
                for i, line in enumerate(lines):
                    line = line.rstrip()
                    if line.endswith(',}') or line.endswith(',]'):
                        # Remove trailing comma before closing brace/bracket
                        line = line[:-2] + line[-1]
                    elif line.endswith('}') or line.endswith(']'):
                        # Check if previous line needs a comma
                        if i > 0 and fixed_lines[-1].strip().endswith('"') and not fixed_lines[-1].strip().endswith(','):
                            fixed_lines[-1] = fixed_lines[-1].rstrip() + ','
                    fixed_lines.append(line)

                content = '\n'.join(fixed_lines)

                # Try to validate again
                try:
                    json.loads(content)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed: {filepath}")
                    return True
                except json.JSONDecodeError:
                    print(f"Could not fix: {filepath}")
                    return False
            else:
                print(f"Unknown error in {filepath}: {e}")
                return False

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    # Find all JSON files in public/locales
    json_files = glob.glob('public/locales/**/*.json', recursive=True)

    fixed_count = 0
    for filepath in json_files:
        if fix_json_file(filepath):
            fixed_count += 1

    print(f"Fixed {fixed_count} files")

if __name__ == "__main__":
    main()