#!/usr/bin/env python3
import json
import os
import glob

def fix_json_file(file_path):
    """Fix JSON file by re-parsing and re-writing it"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Try to parse as JSON
        data = json.loads(content)

        # Write back with proper formatting
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')

        print(f"✅ Fixed {file_path}")
        return True

    except json.JSONDecodeError as e:
        print(f"❌ Could not fix {file_path}: {e}")
        return False
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    # Find all JSON files in public/locales
    json_files = glob.glob('public/locales/**/*.json', recursive=True)

    print(f"🔧 Processing {len(json_files)} JSON files...\n")

    fixed_count = 0
    failed_count = 0

    for file_path in json_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Try to parse
            json.loads(content)
            # Already valid, skip
        except json.JSONDecodeError:
            # Needs fixing
            if fix_json_file(file_path):
                fixed_count += 1
            else:
                failed_count += 1

    print("\n📊 Results:")
    print(f"✅ Successfully fixed: {fixed_count} files")
    print(f"❌ Failed to fix: {failed_count} files")
    print(f"📁 Total files processed: {len(json_files)}")

if __name__ == '__main__':
    main()