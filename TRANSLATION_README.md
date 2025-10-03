# Translation System Documentation

This document provides comprehensive information about the BAOBAB HOPE translation system, including how to use, maintain, and extend the multilingual support for the charity website.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Supported Languages](#supported-languages)
4. [File Structure](#file-structure)
5. [Scripts and Tools](#scripts-and-tools)
6. [Usage Instructions](#usage-instructions)
7. [Adding New Languages](#adding-new-languages)
8. [Adding New Translation Keys](#adding-new-translation-keys)
9. [Translation Quality](#translation-quality)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

## Overview

The BAOBAB HOPE website supports **51 languages** across multiple regions, making it accessible to a global audience. The translation system is built on a namespace-based structure with automated tools for managing and updating translations.

### Key Features

- 🌍 **51 languages** supported across all continents
- 📁 **7 namespaces** for organized content management
- 🤖 **Automated translation updates** with template-based translations
- 🔍 **Validation and quality checks** for translation consistency
- 🧪 **Test mode** for safe updates
- 📊 **Detailed reporting** for translation status

## Architecture

The translation system uses a namespace-based architecture where content is organized into logical groups:

- **actions**: User actions and button text
- **common**: Common UI elements and labels
- **forms**: Form fields and validation messages
- **manifest**: Language metadata and configuration
- **misc**: Miscellaneous content
- **navigation**: Menu items and navigation elements
- **pages**: Page-specific content and text

## Supported Languages

The system supports 51 languages with comprehensive regional coverage:

### European Languages (22)
- Bulgarian (bg), Czech (cs), Danish (da), German (de), Greek (el), English (en), Spanish (es), Estonian (et), Finnish (fi), French (fr), Croatian (hr), Hungarian (hu), Icelandic (is), Italian (it), Lithuanian (lt), Latvian (lv), Dutch (nl), Norwegian (no), Polish (pl), Portuguese (pt), Romanian (ro), Slovak (sk), Slovenian (sl), Serbian (sr), Swedish (sv)

### Asian Languages (8)
- Bengali (bn), Chinese (zh), Hindi (hi), Indonesian (id), Japanese (ja), Korean (ko), Malay (ms), Thai (th), Vietnamese (vi)

### Middle Eastern Languages (4)
- Arabic (ar), Persian (fa), Hebrew (he), Turkish (tr), Urdu (ur)

### African Languages (12)
- Afrikaans (af), Amharic (am), Hausa (ha), Igbo (ig), Swahili (sw), Xhosa (xh), Yoruba (yo), Zulu (zu)

### Celtic and Other Languages (5)
- Welsh (cy), Irish (ga), Filipino (tl)

## File Structure

```
public/locales/
├── en/                     # English (base language)
│   ├── actions.json
│   ├── common.json
│   ├── forms.json
│   ├── manifest.json
│   ├── misc.json
│   ├── navigation.json
│   └── pages.json
├── fr/                     # French translations
│   ├── actions.json
│   └── ... (same structure)
├── es/                     # Spanish translations
│   └── ... (same structure)
└── [other languages]/      # All other supported languages
    └── ... (same structure)

scripts/
├── update-all-languages.js      # Main translation update script
├── run-translation-update.js    # Safe runner for updates
├── validate-translations.js     # Translation validation
└── test-translations.js         # Translation loading tests
```

## Scripts and Tools

### Main Scripts

#### 1. `update-all-languages.js`
The primary script for updating all language files based on English translations.

**Features:**
- Updates all 51 languages automatically
- Preserves existing translations
- Uses translation templates for common terms
- Generates detailed reports
- Supports test mode for safe updates

**Usage:**
```bash
# Update all languages
node scripts/update-all-languages.js

# Test mode (dry run)
node scripts/update-all-languages.js --test

# Update specific languages
node scripts/update-all-languages.js --languages fr,es,de

# Update specific namespaces
node scripts/update-all-languages.js --namespaces common,navigation

# Verbose output
node scripts/update-all-languages.js --verbose
```

#### 2. `run-translation-update.js`
Safe wrapper for running translation updates with error handling.

#### 3. `validate-translations.js`
Validates translation files for syntax errors, missing keys, and quality issues.

#### 4. `test-translations.js`
Tests translation loading functionality.

## Usage Instructions

### Basic Translation Update

1. **Update English source files** in `public/locales/en/`
2. **Run the update script**:
   ```bash
   node scripts/update-all-languages.js
   ```
3. **Validate the results**:
   ```bash
   node scripts/validate-translations.js
   ```

### Safe Testing

Before making changes to production:

```bash
# Run in test mode first
node scripts/update-all-languages.js --test

# If everything looks good, run the actual update
node scripts/update-all-languages.js
```

### Updating Specific Languages

To update only certain languages:

```bash
# Update only French, Spanish, and German
node scripts/update-all-languages.js --languages fr,es,de
```

### Updating Specific Namespaces

To update only certain content areas:

```bash
# Update only common UI elements
node scripts/update-all-languages.js --namespaces common,navigation
```

## Adding New Languages

To add support for a new language:

1. **Add language configuration** in `scripts/update-all-languages.js`:
   ```javascript
   const languageConfig = {
     // ... existing languages
     xx: {  // Replace 'xx' with ISO 639-1 code
       name: "Language Name",
       nativeName: "Native Language Name",
       direction: "ltr", // or "rtl" for right-to-left
       region: "region_name",
       currency: "USD", // or appropriate currency code
       dateFormat: "DD/MM/YYYY"
     }
   };
   ```

2. **Add translation templates** for common terms:
   ```javascript
   const translationTemplates = {
     simple: {
       home: {
         // ... existing translations
         xx: "translated_home" // Add translation
       }
       // ... add for other common terms
     }
   };
   ```

3. **Run the update script**:
   ```bash
   node scripts/update-all-languages.js --languages xx
   ```

4. **Validate the new language**:
   ```bash
   node scripts/validate-translations.js
   ```

## Adding New Translation Keys

When adding new content to the website:

1. **Add the key to English files first** in appropriate namespace:
   ```json
   {
     "newSection": {
       "title": "New Section Title",
       "description": "Description of the new section"
     }
   }
   ```

2. **Run the translation update**:
   ```bash
   node scripts/update-all-languages.js
   ```

3. **Review generated translations** and update manually if needed

## Translation Quality

### Automatic Translation Sources

The system uses several approaches for generating translations:

1. **Template Matching**: Common words and phrases use pre-defined translations
2. **Pattern Recognition**: Emails, phone numbers, URLs are preserved
3. **Currency Conversion**: Monetary amounts are converted to local currency symbols
4. **Placeholder Generation**: Complex text gets placeholder markers for manual translation

### Quality Indicators

Translation quality is tracked through:

- **Completion Percentage**: How many keys have actual translations vs placeholders
- **Structure Consistency**: Whether all languages have the same key structure
- **Validation Status**: JSON syntax and format correctness

### Manual Review Process

For high-quality translations:

1. **Automated generation** provides initial translations
2. **Native speaker review** improves accuracy and cultural appropriateness
3. **Quality scoring** tracks translation improvement over time

## Troubleshooting

### Common Issues

#### JSON Syntax Errors
```bash
# Check for syntax errors
node scripts/validate-translations.js
```

Look for:
- Missing commas
- Unclosed quotes
- Invalid escape sequences

#### Missing Translations
- Check if base English keys exist
- Verify namespace structure matches
- Run update script to fill missing keys

#### Structure Inconsistencies
- Compare language files with English base
- Use validation script to identify mismatches
- Re-run update script to fix structure

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `JSON.parse error` | Invalid JSON syntax | Fix syntax in reported file |
| `Missing key at path` | Translation key missing | Run update script |
| `Type mismatch` | Wrong data type for key | Check English source structure |
| `Empty translation` | Blank translation values | Review and fill empty strings |

## Best Practices

### Content Organization

1. **Use appropriate namespaces** for new content
2. **Keep keys descriptive** but concise
3. **Group related content** in objects
4. **Avoid deep nesting** (max 3-4 levels)

### Translation Management

1. **Always update English first** before running translations
2. **Use test mode** before production updates
3. **Validate regularly** to catch issues early
4. **Back up files** before major updates
5. **Review generated translations** for quality

### Code Integration

1. **Use namespace imports** in React components
2. **Provide fallbacks** for missing translations
3. **Handle pluralization** appropriately
4. **Test with different languages** during development

### Performance Optimization

1. **Lazy load translations** for better performance
2. **Cache translation files** appropriately
3. **Minimize file sizes** by removing unused keys
4. **Use compression** for production deployments

## Maintenance Schedule

### Regular Tasks

- **Weekly**: Validate translation files
- **Monthly**: Review translation quality scores
- **Quarterly**: Update translation templates with new common terms
- **As needed**: Add new language support based on user demographics

### Monitoring

- Track translation completion rates
- Monitor user engagement by language
- Collect feedback on translation quality
- Update based on community contributions

---

## Support and Contribution

For questions about the translation system or to contribute improvements:

- **Technical Issues**: Check the troubleshooting section or run validation scripts
- **New Languages**: Follow the adding new languages process
- **Translation Improvements**: Submit pull requests with better translations
- **Bug Reports**: Include steps to reproduce and error messages

The translation system is designed to be maintainable and extensible, supporting the global mission of BAOBAB HOPE to reach communities worldwide.