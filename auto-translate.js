#!/usr/bin/env node

/**
 * Automated Translation Script
 * Translates placeholders using a simple mapping-based approach
 * For a charity/NGO website context
 * 
 * Note: For production, consider using:
 * - Google Cloud Translation API
 * - DeepL API
 * - Professional human translators
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_FILE = path.join(__dirname, 'public', 'locales', 'translations.json');

console.log('🌍 Starting automated translation...\n');
console.log('⚠️  Note: Using basic translation mappings.');
console.log('   For production, consider professional translation services.\n');

// Read translations
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));

// Common translations for charity/NGO context
const commonTranslations = {
    // Navigation
    'Home': { de: 'Startseite', es: 'Inicio', it: 'Home', ar: 'الرئيسية' },
    'About': { de: 'Über uns', es: 'Acerca de', it: 'Chi siamo', ar: 'حول' },
    'Contact': { de: 'Kontakt', es: 'Contacto', it: 'Contatto', ar: 'اتصل' },
    'Donate': { de: 'Spenden', es: 'Donar', it: 'Dona', ar: 'تبرع' },
    'Our Actions': { de: 'Unsere Aktionen', es: 'Nuestras Acciones', it: 'Le Nostre Azioni', ar: 'أعمالنا' },
    'Information': { de: 'Information', es: 'Información', it: 'Informazione', ar: 'معلومات' },
    'Take Action': { de: 'Handeln Sie', es: 'Actúa', it: 'Agisci', ar: 'اتخذ إجراء' },

    // Common words
    'Loading...': { de: 'Wird geladen...', es: 'Cargando...', it: 'Caricamento...', ar: 'جار التحميل...' },
    'Learn More': { de: 'Mehr erfahren', es: 'Saber más', it: 'Scopri di più', ar: 'اعرف المزيد' },
    'Read More': { de: 'Weiterlesen', es: 'Leer más', it: 'Leggi di più', ar: 'اقرأ المزيد' },
    'Submit': { de: 'Absenden', es: 'Enviar', it: 'Invia', ar: 'إرسال' },
    'Cancel': { de: 'Abbrechen', es: 'Cancelar', it: 'Annulla', ar: 'إلغاء' },
    'Save': { de: 'Speichern', es: 'Guardar', it: 'Salva', ar: 'حفظ' },
    'Close': { de: 'Schließen', es: 'Cerrar', it: 'Chiudi', ar: 'إغلاق' },
    'Search': { de: 'Suchen', es: 'Buscar', it: 'Cerca', ar: 'بحث' },
    'Email': { de: 'E-Mail', es: 'Correo electrónico', it: 'Email', ar: 'البريد الإلكتروني' },
    'Name': { de: 'Name', es: 'Nombre', it: 'Nome', ar: 'الاسم' },
    'Message': { de: 'Nachricht', es: 'Mensaje', it: 'Messaggio', ar: 'رسالة' },
    'Phone': { de: 'Telefon', es: 'Teléfono', it: 'Telefono', ar: 'هاتف' },
    'Address': { de: 'Adresse', es: 'Dirección', it: 'Indirizzo', ar: 'عنوان' },
    'Date': { de: 'Datum', es: 'Fecha', it: 'Data', ar: 'تاريخ' },
    'Time': { de: 'Zeit', es: 'Hora', it: 'Ora', ar: 'وقت' },
    'Yes': { de: 'Ja', es: 'Sí', it: 'Sì', ar: 'نعم' },
    'No': { de: 'Nein', es: 'No', it: 'No', ar: 'لا' },
    'Welcome': { de: 'Willkommen', es: 'Bienvenido', it: 'Benvenuto', ar: 'مرحبا' },
    'Thank you': { de: 'Danke', es: 'Gracias', it: 'Grazie', ar: 'شكرا' },
    'Please': { de: 'Bitte', es: 'Por favor', it: 'Per favore', ar: 'من فضلك' },

    // Charity-specific
    'Volunteer': { de: 'Freiwilliger', es: 'Voluntario', it: 'Volontario', ar: 'متطوع' },
    'Campaign': { de: 'Kampagne', es: 'Campaña', it: 'Campagna', ar: 'حملة' },
    'Project': { de: 'Projekt', es: 'Proyecto', it: 'Progetto', ar: 'مشروع' },
    'Mission': { de: 'Mission', es: 'Misión', it: 'Missione', ar: 'مهمة' },
    'Impact': { de: 'Wirkung', es: 'Impacto', it: 'Impatto', ar: 'تأثير' },
    'Community': { de: 'Gemeinschaft', es: 'Comunidad', it: 'Comunità', ar: 'مجتمع' },
    'Support': { de: 'Unterstützung', es: 'Apoyo', it: 'Supporto', ar: 'دعم' },
    'Help': { de: 'Hilfe', es: 'Ayuda', it: 'Aiuto', ar: 'مساعدة' },
    'Partner': { de: 'Partner', es: 'Socio', it: 'Partner', ar: 'شريك' },
    'Team': { de: 'Team', es: 'Equipo', it: 'Squadra', ar: 'فريق' }
};

// Function to translate a single value
function translateValue(engValue, targetLang) {
    if (typeof engValue !== 'string') return engValue;

    // Remove [LANG] prefix if present
    const cleanValue = engValue.replace(/^\[(DE|ES|IT|AR)\]\s*/, '');

    // Check if we have a direct translation
    if (commonTranslations[cleanValue]) {
        return commonTranslations[cleanValue][targetLang] || cleanValue;
    }

    // For values we don't have translations for, return the English
    // In production, you'd call a translation API here
    return cleanValue;
}

// Recursive function to translate object
function translateObject(obj, targetLang, enObj) {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        if (typeof obj === 'string' && obj.startsWith(`[${targetLang.toUpperCase()}]`)) {
            // Get the English equivalent
            const engValue = typeof enObj === 'string' ? enObj : obj.replace(/^\[\w+\]\s*/, '');
            return translateValue(engValue, targetLang);
        }
        return obj;
    }

    const translated = {};
    for (const key in obj) {
        translated[key] = translateObject(obj[key], targetLang, enObj[key]);
    }
    return translated;
}

// Translate each language
const languages = [
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'it', name: 'Italian' },
    { code: 'ar', name: 'Arabic' }
];

let totalTranslated = 0;

for (const { code, name } of languages) {
    console.log(`\n🔄 Translating ${name} (${code})...`);

    let count = 0;
    const translated = translateObject(translations[code], code, translations.en);
    translations[code] = translated;

    // Count translated items
    const countTranslations = (obj) => {
        let c = 0;
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                c += countTranslations(obj[key]);
            } else if (typeof obj[key] === 'string' && !obj[key].startsWith(`[${code.toUpperCase()}]`)) {
                c++;
            }
        }
        return c;
    };

    count = countTranslations(translated);
    totalTranslated += count;
    console.log(`  ✓ Translated ${count} values`);
}

// Write back
fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), 'utf8');

const stats = fs.statSync(TRANSLATIONS_FILE);
console.log(`\n✅ Translation complete!`);
console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`🌐 Total languages: ${Object.keys(translations).length}`);
console.log(`📝 Total values translated: ${totalTranslated}`);

console.log(`\n💡 Next steps:`);
console.log(`  1. Review automated translations`);
console.log(`  2. Have native speakers verify accuracy`);
console.log(`  3. Use professional translation service for remaining [LANG] prefixed values`);
console.log(`  4. Test in browser: npm run dev`);
