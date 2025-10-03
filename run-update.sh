#!/bin/bash

# Run Update All Languages Script
# This script safely executes the update-all-languages.js script

echo "🚀 Starting language files update..."
echo "📅 Started at: $(date)"

# Change to the correct directory
cd "$(dirname "$0")/.."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    exit 1
fi

# Check if the update script exists
if [ ! -f "scripts/update-all-languages.js" ]; then
    echo "❌ Update script not found: scripts/update-all-languages.js"
    exit 1
fi

# Check if locales directory exists
if [ ! -d "public/locales" ]; then
    echo "❌ Locales directory not found: public/locales"
    exit 1
fi

# Check if English directory exists
if [ ! -d "public/locales/en" ]; then
    echo "❌ English locales directory not found: public/locales/en"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Run the update script
node scripts/update-all-languages.js

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Language update completed successfully!"
    echo "📅 Finished at: $(date)"

    # Run validation if available
    if [ -f "scripts/validate-translations.js" ]; then
        echo ""
        echo "🔍 Running translation validation..."
        node scripts/validate-translations.js
    fi
else
    echo ""
    echo "❌ Language update failed!"
    exit 1
fi
