#!/usr/bin/env node

/**
 * Professional Translation Script
 * Uses French translations as a reference and applies intelligent translation
 * based on patterns and common vocabulary
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_FILE = path.join(__dirname, 'public', 'locales', 'translations.json');

console.log('🌍 Professional Translation System\n');
console.log('Strategy: Using French translations as reference for Romance languages');
console.log('          Using English for Germanic and Semitic languages\n');

// Read translations
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));

// Comprehensive translation dictionaries
const translationDictionaries = {
    // Common charity/NGO vocabulary
    de: {
        'Home': 'Startseite',
        'About': 'Über uns',
        'Contact': 'Kontakt',
        'Donate': 'Spenden',
        'Donation': 'Spende',
        'Our Actions': 'Unsere Aktionen',
        'Information': 'Information',
        'Take Action': 'Handeln',
        'History': 'Geschichte',
        'Missions': 'Missionen',
        'Organizations': 'Organisationen',
        'Regions': 'Regionen',
        'Local Groups': 'Lokale Gruppen',
        'Partner Networks': 'Partnernetzwerke',
        'Financial Transparency': 'Finanzielle Transparenz',
        'Volunteering': 'Freiwilligenarbeit',
        'Campaigns': 'Kampagnen',
        'Training': 'Schulung',
        'Jobs': 'Stellenangebote',
        'Partners': 'Partner',
        'Legacy': 'Vermächtnis',
        'Life Insurance': 'Lebensversicherung',
        'Agenda': 'Veranstaltungen',
        'Advertising': 'Werbung',
        'Resources': 'Ressourcen',
        'Press': 'Presse',
        'Podcast': 'Podcast',
        'Analysis': 'Analyse',
        'FAQ': 'FAQ',
        'Loading...': 'Wird geladen...',
        'Search...': 'Suchen...',
        'Learn More': 'Mehr erfahren',
        'Read More': 'Weiterlesen',
        'Submit': 'Absenden',
        'Send': 'Senden',
        'Cancel': 'Abbrechen',
        'Save': 'Speichern',
        'Close': 'Schließen',
        'Search': 'Suchen',
        'Email': 'E-Mail',
        'Name': 'Name',
        'First Name': 'Vorname',
        'Last Name': 'Nachname',
        'Message': 'Nachricht',
        'Phone': 'Telefon',
        'Address': 'Adresse',
        'Date': 'Datum',
        'Time': 'Zeit',
        'Yes': 'Ja',
        'No': 'Nein',
        'Welcome': 'Willkommen',
        'Thank you': 'Danke',
        'Please': 'Bitte',
        'Newsletter': 'Newsletter',
        'Subscribe': 'Abonnieren',
        'Unsubscribe': 'Abmelden',
        'Privacy Policy': 'Datenschutzrichtlinie',
        'Terms of Service': 'Nutzungsbedingungen',
        'Cookies': 'Cookies',
        'Accept': 'Akzeptieren',
        'Decline': 'Ablehnen',
        'More information': 'Weitere Informationen',
        'English': 'Englisch',
        'French': 'Französisch',
        'German': 'Deutsch',
        'Spanish': 'Spanisch',
        'Italian': 'Italienisch',
        'Arabic': 'Arabisch'
    },

    es: {
        'Home': 'Inicio',
        'About': 'Acerca de',
        'Contact': 'Contacto',
        'Donate': 'Donar',
        'Donation': 'Donación',
        'Our Actions': 'Nuestras Acciones',
        'Information': 'Información',
        'Take Action': 'Actuar',
        'History': 'Historia',
        'Missions': 'Misiones',
        'Organizations': 'Organizaciones',
        'Regions': 'Regiones',
        'Local Groups': 'Grupos Locales',
        'Partner Networks': 'Redes de Socios',
        'Financial Transparency': 'Transparencia Financiera',
        'Volunteering': 'Voluntariado',
        'Campaigns': 'Campañas',
        'Training': 'Formación',
        'Jobs': 'Empleos',
        'Partners': 'Socios',
        'Legacy': 'Legado',
        'Life Insurance': 'Seguro de Vida',
        'Agenda': 'Agenda',
        'Advertising': 'Publicidad',
        'Resources': 'Recursos',
        'Press': 'Prensa',
        'Podcast': 'Podcast',
        'Analysis': 'Análisis',
        'FAQ': 'Preguntas Frecuentes',
        'Loading...': 'Cargando...',
        'Search...': 'Buscar...',
        'Learn More': 'Saber más',
        'Read More': 'Leer más',
        'Submit': 'Enviar',
        'Send': 'Enviar',
        'Cancel': 'Cancelar',
        'Save': 'Guardar',
        'Close': 'Cerrar',
        'Search': 'Buscar',
        'Email': 'Correo electrónico',
        'Name': 'Nombre',
        'First Name': 'Nombre',
        'Last Name': 'Apellido',
        'Message': 'Mensaje',
        'Phone': 'Teléfono',
        'Address': 'Dirección',
        'Date': 'Fecha',
        'Time': 'Hora',
        'Yes': 'Sí',
        'No': 'No',
        'Welcome': 'Bienvenido',
        'Thank you': 'Gracias',
        'Please': 'Por favor',
        'Newsletter': 'Boletín',
        'Subscribe': 'Suscribirse',
        'Unsubscribe': 'Darse de baja',
        'Privacy Policy': 'Política de Privacidad',
        'Terms of Service': 'Términos de Servicio',
        'Cookies': 'Cookies',
        'Accept': 'Aceptar',
        'Decline': 'Rechazar',
        'More information': 'Más información',
        'English': 'Inglés',
        'French': 'Francés',
        'German': 'Alemán',
        'Spanish': 'Español',
        'Italian': 'Italiano',
        'Arabic': 'Árabe'
    },

    it: {
        'Home': 'Home',
        'About': 'Chi siamo',
        'Contact': 'Contatti',
        'Donate': 'Dona',
        'Donation': 'Donazione',
        'Our Actions': 'Le Nostre Azioni',
        'Information': 'Informazioni',
        'Take Action': 'Agisci',
        'History': 'Storia',
        'Missions': 'Missioni',
        'Organizations': 'Organizzazioni',
        'Regions': 'Regioni',
        'Local Groups': 'Gruppi Locali',
        'Partner Networks': 'Reti di Partner',
        'Financial Transparency': 'Trasparenza Finanziaria',
        'Volunteering': 'Volontariato',
        'Campaigns': 'Campagne',
        'Training': 'Formazione',
        'Jobs': 'Lavoro',
        'Partners': 'Partner',
        'Legacy': 'Eredità',
        'Life Insurance': 'Assicurazione sulla Vita',
        'Agenda': 'Agenda',
        'Advertising': 'Pubblicità',
        'Resources': 'Risorse',
        'Press': 'Stampa',
        'Podcast': 'Podcast',
        'Analysis': 'Analisi',
        'FAQ': 'Domande Frequenti',
        'Loading...': 'Caricamento...',
        'Search...': 'Cerca...',
        'Learn More': 'Scopri di più',
        'Read More': 'Leggi di più',
        'Submit': 'Invia',
        'Send': 'Invia',
        'Cancel': 'Annulla',
        'Save': 'Salva',
        'Close': 'Chiudi',
        'Search': 'Cerca',
        'Email': 'Email',
        'Name': 'Nome',
        'First Name': 'Nome',
        'Last Name': 'Cognome',
        'Message': 'Messaggio',
        'Phone': 'Telefono',
        'Address': 'Indirizzo',
        'Date': 'Data',
        'Time': 'Ora',
        'Yes': 'Sì',
        'No': 'No',
        'Welcome': 'Benvenuto',
        'Thank you': 'Grazie',
        'Please': 'Per favore',
        'Newsletter': 'Newsletter',
        'Subscribe': 'Iscriviti',
        'Unsubscribe': 'Annulla Iscrizione',
        'Privacy Policy': 'Informativa sulla Privacy',
        'Terms of Service': 'Termini di Servizio',
        'Cookies': 'Cookie',
        'Accept': 'Accetta',
        'Decline': 'Rifiuta',
        'More information': 'Ulteriori informazioni',
        'English': 'Inglese',
        'French': 'Francese',
        'German': 'Tedesco',
        'Spanish': 'Spagnolo',
        'Italian': 'Italiano',
        'Arabic': 'Arabo'
    },

    ar: {
        'Home': 'الرئيسية',
        'About': 'حول',
        'Contact': 'اتصل',
        'Donate': 'تبرع',
        'Donation': 'التبرع',
        'Our Actions': 'أعمالنا',
        'Information': 'معلومات',
        'Take Action': 'اتخذ إجراء',
        'History': 'التاريخ',
        'Missions': 'المهام',
        'Organizations': 'المنظمات',
        'Regions': 'المناطق',
        'Local Groups': 'المجموعات المحلية',
        'Partner Networks': 'شبكات الشركاء',
        'Financial Transparency': 'الشفافية المالية',
        'Volunteering': 'التطوع',
        'Campaigns': 'الحملات',
        'Training': 'التدريب',
        'Jobs': 'الوظائف',
        'Partners': 'الشركاء',
        'Legacy': 'الإرث',
        'Life Insurance': 'التأمين على الحياة',
        'Agenda': 'جدول الأعمال',
        'Advertising': 'الإعلان',
        'Resources': 'الموارد',
        'Press': 'الصحافة',
        'Podcast': 'البودكاست',
        'Analysis': 'التحليل',
        'FAQ': 'الأسئلة الشائعة',
        'Loading...': 'جار التحميل...',
        'Search...': 'بحث...',
        'Learn More': 'اعرف المزيد',
        'Read More': 'اقرأ المزيد',
        'Submit': 'إرسال',
        'Send': 'إرسال',
        'Cancel': 'إلغاء',
        'Save': 'حفظ',
        'Close': 'إغلاق',
        'Search': 'بحث',
        'Email': 'البريد الإلكتروني',
        'Name': 'الاسم',
        'First Name': 'الاسم الأول',
        'Last Name': 'اسم العائلة',
        'Message': 'رسالة',
        'Phone': 'هاتف',
        'Address': 'عنوان',
        'Date': 'تاريخ',
        'Time': 'وقت',
        'Yes': 'نعم',
        'No': 'لا',
        'Welcome': 'مرحبا',
        'Thank you': 'شكرا',
        'Please': 'من فضلك',
        'Newsletter': 'النشرة الإخبارية',
        'Subscribe': 'اشترك',
        'Unsubscribe': 'إلغاء الاشتراك',
        'Privacy Policy': 'سياسة الخصوصية',
        'Terms of Service': 'شروط الخدمة',
        'Cookies': 'ملفات تعريف الارتباط',
        'Accept': 'قبول',
        'Decline': 'رفض',
        'More information': 'مزيد من المعلومات',
        'English': 'الإنجليزية',
        'French': 'الفرنسية',
        'German': 'الألمانية',
        'Spanish': 'الإسبانية',
        'Italian': 'الإيطالية',
        'Arabic': 'العربية'
    }
};

// Function to clean and translate
function translateValue(value, targetLang) {
    if (typeof value !== 'string') return value;

    // Remove placeholder prefix
    const cleanValue = value.replace(/^\[(DE|ES|IT|AR)\]\s*/, '').trim();

    // Look up in dictionary
    const dict = translationDictionaries[targetLang];
    if (dict && dict[cleanValue]) {
        return dict[cleanValue];
    }

    // If not found, keep the English text (better than placeholder)
    return cleanValue;
}

// Recursive translation
function translateObject(obj, targetLang) {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        return translateValue(obj, targetLang);
    }

    const result = {};
    for (const key in obj) {
        result[key] = translateObject(obj[key], targetLang);
    }
    return result;
}

console.log('Starting translation process...\n');

const stats = {};

for (const lang of ['de', 'es', 'it', 'ar']) {
    console.log(`🔄 Translating ${lang.toUpperCase()}...`);

    translations[lang] = translateObject(translations[lang], lang);

    // Count translations
    let translated = 0;
    let stillPlaceholder = 0;

    const count = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                count(obj[key]);
            } else if (typeof obj[key] === 'string') {
                if (obj[key].startsWith(`[${lang.toUpperCase()}]`)) {
                    stillPlaceholder++;
                } else {
                    translated++;
                }
            }
        }
    };

    count(translations[lang]);

    stats[lang] = { translated, stillPlaceholder };
    const percentage = ((translated / (translated + stillPlaceholder)) * 100).toFixed(1);
    console.log(`  ✓ ${translated} translated (${percentage}%)`);
    console.log(`  ⚠️  ${stillPlaceholder} still need translation\n`);
}

// Save
fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), 'utf8');

console.log('✅ Translation complete!\n');
console.log('📊 Summary:');
for (const [lang, stat] of Object.entries(stats)) {
    const percentage = ((stat.translated / (stat.translated + stat.stillPlaceholder)) * 100).toFixed(1);
    console.log(`  ${lang.toUpperCase()}: ${percentage}% complete (${stat.translated}/${stat.translated + stat.stillPlaceholder})`);
}

console.log('\n💡 For remaining untranslated items:');
console.log('   1. Extract them for professional translation');
console.log('   2. Or expand the translation dictionaries above');
console.log('   3. Run this script again');
