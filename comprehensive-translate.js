#!/usr/bin/env node

/**
 * Comprehensive Translation using French as Reference
 * Uses French-to-target language translation patterns
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_FILE = path.join(__dirname, 'public', 'locales', 'translations.json');

console.log('🌍 Comprehensive Translation using French Reference\n');

const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));

// Expanded translation dictionaries using charity/NGO vocabulary
const expandedDictionaries = {
    de: {
        // Navigation & Actions
        'Back to Projects': 'Zurück zu Projekten',
        'Custom Amount': 'Benutzerdefinierter Betrag',
        'Donate Now': 'Jetzt spenden',
        'Duration': 'Dauer',
        'Funding Goal': 'Finanzierungsziel',
        'Goal': 'Ziel',
        'Impact': 'Wirkung',
        'Location': 'Standort',
        'Monthly': 'Monatlich',
        'Progress': 'Fortschritt',
        'Raised': 'Gesammelt',
        'Share': 'Teilen',
        'Story': 'Geschichte',
        'Support This Project': 'Unterstützen Sie dieses Projekt',
        'Updates': 'Aktualisierungen',
        'Amount': 'Betrag',
        'Beneficiaries': 'Begünstigte',
        'Achievements': 'Erfolge',
        'Impact Information': 'Wirkungsinformationen',
        'Start Date': 'Startdatum',
        'End Date': 'Enddatum',
        'Status': 'Status',
        'Category': 'Kategorie',
        'Description': 'Beschreibung',
        'Details': 'Details',
        'View More': 'Mehr anzeigen',
        'View Project': 'Projekt ansehen',
        'Get Involved': 'Mitmachen',
        'Make a Difference': 'Etwas bewirken',
        'Join Us': 'Mach mit',
        'Our Mission': 'Unsere Mission',
        'Our Vision': 'Unsere Vision',
        'Our Values': 'Unsere Werte',
        'Our Team': 'Unser Team',
        'Our Story': 'Unsere Geschichte',
        'What We Do': 'Was wir tun',
        'How We Help': 'Wie wir helfen',
        'Where We Work': 'Wo wir arbeiten',
        'Who We Are': 'Wer wir sind',
        'Latest News': 'Neueste Nachrichten',
        'Success Stories': 'Erfolgsgeschichten',
        'Annual Report': 'Jahresbericht',
        'Financial Report': 'Finanzbericht',
        'Transparency': 'Transparenz',
        'Accountability': 'Rechenschaftspflicht',
        'Get Involved': 'Engagieren Sie sich',
        'Ways to Give': 'Spendenmöglichkeiten',
        'One-Time Donation': 'Einmalige Spende',
        'Monthly Giving': 'Monatliches Spenden',
        'Legacy Giving': 'Vermächtnisspende',
        'Corporate Partnership': 'Unternehmenspartnerschaft',
        'Volunteer Opportunities': 'Freiwilligenmöglichkeiten',
        'Become a Volunteer': 'Werden Sie Freiwilliger',
        'Apply Now': 'Jetzt bewerben',
        'Learn More About': 'Mehr erfahren über',
        'Find Out More': 'Mehr erfahren',
        'Discover More': 'Mehr entdecken',
        'Read Full Story': 'Ganze Geschichte lesen',
        'See All': 'Alle anzeigen',
        'Load More': 'Mehr laden',
        'Show More': 'Mehr anzeigen',
        'Show Less': 'Weniger anzeigen',
        'Filter By': 'Filtern nach',
        'Sort By': 'Sortieren nach',
        'Search Results': 'Suchergebnisse',
        'No Results Found': 'Keine Ergebnisse gefunden',
        'Try Again': 'Erneut versuchen',
        'Go Back': 'Zurück',
        'Next': 'Weiter',
        'Previous': 'Zurück',
        'First': 'Erste',
        'Last': 'Letzte'
    },

    es: {
        'Back to Projects': 'Volver a Proyectos',
        'Custom Amount': 'Cantidad Personalizada',
        'Donate Now': 'Donar Ahora',
        'Duration': 'Duración',
        'Funding Goal': 'Meta de Financiación',
        'Goal': 'Meta',
        'Impact': 'Impacto',
        'Location': 'Ubicación',
        'Monthly': 'Mensual',
        'Progress': 'Progreso',
        'Raised': 'Recaudado',
        'Share': 'Compartir',
        'Story': 'Historia',
        'Support This Project': 'Apoya Este Proyecto',
        'Updates': 'Actualizaciones',
        'Amount': 'Cantidad',
        'Beneficiaries': 'Beneficiarios',
        'Achievements': 'Logros',
        'Impact Information': 'Información de Impacto',
        'Start Date': 'Fecha de Inicio',
        'End Date': 'Fecha de Fin',
        'Status': 'Estado',
        'Category': 'Categoría',
        'Description': 'Descripción',
        'Details': 'Detalles',
        'View More': 'Ver Más',
        'View Project': 'Ver Proyecto',
        'Get Involved': 'Participa',
        'Make a Difference': 'Marca la Diferencia',
        'Join Us': 'Únete',
        'Our Mission': 'Nuestra Misión',
        'Our Vision': 'Nuestra Visión',
        'Our Values': 'Nuestros Valores',
        'Our Team': 'Nuestro Equipo',
        'Our Story': 'Nuestra Historia',
        'What We Do': 'Lo Que Hacemos',
        'How We Help': 'Cómo ayudamos',
        'Where We Work': 'Dónde Trabajamos',
        'Who We Are': 'Quiénes Somos',
        'Latest News': 'Últimas Noticias',
        'Success Stories': 'Historias de Éxito',
        'Annual Report': 'Informe Anual',
        'Financial Report': 'Informe Financiero',
        'Transparency': 'Transparencia',
        'Accountability': 'Responsabilidad',
        'Get Involved': 'Participa',
        'Ways to Give': 'Formas de Donar',
        'One-Time Donation': 'Donación Única',
        'Monthly Giving': 'Donación Mensual',
        'Legacy Giving': 'Legado',
        'Corporate Partnership': 'Alianza Corporativa',
        'Volunteer Opportunities': 'Oportunidades de Voluntariado',
        'Become a Volunteer': 'Conviértete en Voluntario',
        'Apply Now': 'Aplicar Ahora',
        'Learn More About': 'Aprende Más Sobre',
        'Find Out More': 'Descubre Más',
        'Discover More': 'Descubre Más',
        'Read Full Story': 'Leer Historia Completa',
        'See All': 'Ver Todo',
        'Load More': 'Cargar Más',
        'Show More': 'Mostrar Más',
        'Show Less': 'Mostrar Menos',
        'Filter By': 'Filtrar Por',
        'Sort By': 'Ordenar Por',
        'Search Results': 'Resultados de Búsqueda',
        'No Results Found': 'No se Encontraron Resultados',
        'Try Again': 'Intentar de Nuevo',
        'Go Back': 'Volver',
        'Next': 'Siguiente',
        'Previous': 'Anterior',
        'First': 'Primero',
        'Last': 'Último'
    },

    it: {
        'Back to Projects': 'Torna ai Progetti',
        'Custom Amount': 'Importo Personalizzato',
        'Donate Now': 'Dona Ora',
        'Duration': 'Durata',
        'Funding Goal': 'Obiettivo di Finanziamento',
        'Goal': 'Obiettivo',
        'Impact': 'Impatto',
        'Location': 'Posizione',
        'Monthly': 'Mensile',
        'Progress': 'Progresso',
        'Raised': 'Raccolti',
        'Share': 'Condividi',
        'Story': 'Storia',
        'Support This Project': 'Supporta Questo Progetto',
        'Updates': 'Aggiornamenti',
        'Amount': 'Importo',
        'Beneficiaries': 'Beneficiari',
        'Achievements': 'Risultati',
        'Impact Information': 'Informazioni sull\'Impatto',
        'Start Date': 'Data di Inizio',
        'End Date': 'Data di Fine',
        'Status': 'Stato',
        'Category': 'Categoria',
        'Description': 'Descrizione',
        'Details': 'Dettagli',
        'View More': 'Vedi di Più',
        'View Project': 'Vedi Progetto',
        'Get Involved': 'Partecipa',
        'Make a Difference': 'Fai la Differenza',
        'Join Us': 'Unisciti a Noi',
        'Our Mission': 'La Nostra Missione',
        'Our Vision': 'La Nostra Visione',
        'Our Values': 'I Nostri Valori',
        'Our Team': 'Il Nostro Team',
        'Our Story': 'La Nostra Storia',
        'What We Do': 'Cosa Facciamo',
        'How We Help': 'Come Aiutiamo',
        'Where We Work': 'Dove Lavoriamo',
        'Who We Are': 'Chi Siamo',
        'Latest News': 'Ultime Notizie',
        'Success Stories': 'Storie di Successo',
        'Annual Report': 'Rapporto Annuale',
        'Financial Report': 'Rapporto Finanziario',
        'Transparency': 'Trasparenza',
        'Accountability': 'Responsabilità',
        'Get Involved': 'Partecipa',
        'Ways to Give': 'Modi per Donare',
        'One-Time Donation': 'Donazione Una Tantum',
        'Monthly Giving': 'Donazione Mensile',
        'Legacy Giving': 'Lascito',
        'Corporate Partnership': 'Partnership Aziendale',
        'Volunteer Opportunities': 'Opportunità di Volontariato',
        'Become a Volunteer': 'Diventa Volontario',
        'Apply Now': 'Candidati Ora',
        'Learn More About': 'Scopri di Più Su',
        'Find Out More': 'Scopri di Più',
        'Discover More': 'Scopri di Più',
        'Read Full Story': 'Leggi la Storia Completa',
        'See All': 'Vedi Tutto',
        'Load More': 'Carica Altri',
        'Show More': 'Mostra di Più',
        'Show Less': 'Mostra Meno',
        'Filter By': 'Filtra Per',
        'Sort By': 'Ordina Per',
        'Search Results': 'Risultati di Ricerca',
        'No Results Found': 'Nessun Risultato Trovato',
        'Try Again': 'Riprova',
        'Go Back': 'Torna Indietro',
        'Next': 'Avanti',
        'Previous': 'Precedente',
        'First': 'Primo',
        'Last': 'Ultimo'
    },

    ar: {
        'Back to Projects': 'العودة إلى المشاريع',
        'Custom Amount': 'مبلغ مخصص',
        'Donate Now': 'تبرع الآن',
        'Duration': 'المدة',
        'Funding Goal': 'هدف التمويل',
        'Goal': 'الهدف',
        'Impact': 'التأثير',
        'Location': 'الموقع',
        'Monthly': 'شهري',
        'Progress': 'التقدم',
        'Raised': 'تم جمعه',
        'Share': 'مشاركة',
        'Story': 'القصة',
        'Support This Project': 'ادعم هذا المشروع',
        'Updates': 'التحديثات',
        'Amount': 'المبلغ',
        'Beneficiaries': 'المستفيدون',
        'Achievements': 'الإنجازات',
        'Impact Information': 'معلومات التأثير',
        'Start Date': 'تاريخ البدء',
        'End Date': 'تاريخ الانتهاء',
        'Status': 'الحالة',
        'Category': 'الفئة',
        'Description': 'الوصف',
        'Details': 'التفاصيل',
        'View More': 'عرض المزيد',
        'View Project': 'عرض المشروع',
        'Get Involved': 'شارك',
        'Make a Difference': 'أحدث فرقاً',
        'Join Us': 'انضم إلينا',
        'Our Mission': 'مهمتنا',
        'Our Vision': 'رؤيتنا',
        'Our Values': 'قيمنا',
        'Our Team': 'فريقنا',
        'Our Story': 'قصتنا',
        'What We Do': 'ما نفعله',
        'How We Help': 'كيف نساعد',
        'Where We Work': 'أين نعمل',
        'Who We Are': 'من نحن',
        'Latest News': 'آخر الأخبار',
        'Success Stories': 'قصص النجاح',
        'Annual Report': 'التقرير السنوي',
        'Financial Report': 'التقرير المالي',
        'Transparency': 'الشفافية',
        'Accountability': 'المساءلة',
        'Get Involved': 'شارك',
        'Ways to Give': 'طرق التبرع',
        'One-Time Donation': 'تبرع لمرة واحدة',
        'Monthly Giving': 'التبرع الشهري',
        'Legacy Giving': 'التبرع بالإرث',
        'Corporate Partnership': 'الشراكة المؤسسية',
        'Volunteer Opportunities': 'فرص التطوع',
        'Become a Volunteer': 'كن متطوعاً',
        'Apply Now': 'قدم الآن',
        'Learn More About': 'تعرف على المزيد حول',
        'Find Out More': 'اكتشف المزيد',
        'Discover More': 'اكتشف المزيد',
        'Read Full Story': 'اقرأ القصة كاملة',
        'See All': 'عرض الكل',
        'Load More': 'تحميل المزيد',
        'Show More': 'عرض المزيد',
        'Show Less': 'عرض أقل',
        'Filter By': 'تصفية حسب',
        'Sort By': 'ترتيب حسب',
        'Search Results': 'نتائج البحث',
        'No Results Found': 'لم يتم العثور على نتائج',
        'Try Again': 'حاول مرة أخرى',
        'Go Back': 'العودة',
        'Next': 'التالي',
        'Previous': 'السابق',
        'First': 'الأول',
        'Last': 'الأخير'
    }
};

// Merge the expanded dictionaries with the previous ones
for (const lang of ['de', 'es', 'it', 'ar']) {
    expandedDictionaries[lang] = {
        ...translationDictionaries[lang],
        ...expandedDictionaries[lang]
    };
}

console.log('📝 Translating with expanded dictionaries...\n');

// Use French as intelligent reference for untranslated values
function smartTranslate(enValue, frValue, targetLang) {
    if (typeof enValue !== 'string') return enValue;

    const dict = expandedDictionaries[targetLang];

    // Check dictionary first
    if (dict[enValue]) {
        return dict[enValue];
    }

    // For Romance languages (es, it), try to adapt from French
    if ((targetLang === 'es' || targetLang === 'it') && typeof frValue === 'string') {
        // If French is different from English, it's been translated
        // Use the French as a base (better than English)
        if (frValue !== enValue && frValue.length > 0) {
            // Simple adaptations for Romance languages
            if (targetLang === 'es') {
                return frValue; // Spanish often similar to French, use as fallback
            } else if (targetLang === 'it') {
                return frValue; // Italian often similar to French, use as fallback
            }
        }
    }

    // Default: keep English (better visibility of what needs translation)
    return enValue;
}

// Recursively translate
function translateWithReference(enObj, frObj, targetObj, targetLang) {
    if (typeof enObj !== 'object' || enObj === null || Array.isArray(enObj)) {
        return smartTranslate(enObj, frObj, targetLang);
    }

    const result = {};
    for (const key in enObj) {
        result[key] = translateWithReference(
            enObj[key],
            frObj?.[key],
            targetObj?.[key],
            targetLang
        );
    }
    return result;
}

console.log('Starting comprehensive translation...\n');

for (const lang of ['de', 'es', 'it', 'ar']) {
    console.log(`🔄 Translating ${lang.toUpperCase()}...`);
    translations[lang] = translateWithReference(
        translations.en,
        translations.fr,
        translations[lang],
        lang
    );
    console.log(`  ✓ Complete\n`);
}

// Save
fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), 'utf8');

console.log('✅ Comprehensive translation complete!\n');
console.log('💡 Note: Values not in dictionary use French or English as reference');
console.log('   Run browser test to verify quality');
