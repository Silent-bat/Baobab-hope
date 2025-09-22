#!/usr/bin/env python3
"""
Script de vérification finale pour tous les fichiers JSON
"""
import json
import os
import glob

def verify_json_file(filepath):
    """Vérifie qu'un fichier JSON est valide"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            json.load(f)
        return True, None
    except json.JSONDecodeError as e:
        return False, str(e)
    except Exception as e:
        return False, str(e)

def main():
    """Fonction principale"""
    print("🔍 Vérification finale de tous les fichiers JSON...")

    # Find all JSON files in public/locales
    json_files = glob.glob("public/locales/**/*.json", recursive=True)
    total_files = len(json_files)

    print(f"📁 Vérification de {total_files} fichiers JSON...")

    valid_count = 0
    invalid_count = 0
    errors = []

    for filepath in json_files:
        is_valid, error = verify_json_file(filepath)
        if is_valid:
            valid_count += 1
            print(f"✅ {filepath}: Valide")
        else:
            invalid_count += 1
            errors.append((filepath, error))
            print(f"❌ {filepath}: {error}")

    # Print summary
    print("\n📊 Résultats finaux:")
    print(f"✅ Fichiers JSON valides: {valid_count}")
    print(f"❌ Fichiers JSON invalides: {invalid_count}")
    print(f"📁 Total des fichiers vérifiés: {total_files}")

    if invalid_count == 0:
        print("\n🎉 TOUS LES FICHIERS JSON SONT MAINTENANT VALIDES !")
    else:
        print(f"\n⚠️  Il reste {invalid_count} fichiers à corriger:")
        for filepath, error in errors:
            print(f"  - {filepath}: {error}")

if __name__ == "__main__":
    main()