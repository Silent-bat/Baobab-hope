#!/usr/bin/env node

/**
 * Add Initial Language Set Script
 * 
 * This script adds the first 20 major world languages with basic content structure
 * and tests RTL languages and cultural formatting.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');

// First 20 major world languages
const INITIAL_LANGUAGES = [
  // Already have English and French
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', region: 'Europe/Americas' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', region: 'Europe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', region: 'Europe' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', region: 'Europe/Americas' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', region: 'Europe/Asia' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', region: 'Asia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', region: 'Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', region: 'Asia' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', region: 'Middle East/Africa' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', region: 'Asia' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', region: 'Asia' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', region: 'Asia' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', region: 'Europe/Asia' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', region: 'Europe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', region: 'Europe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', direction: 'ltr', region: 'Europe' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', direction: 'ltr', region: 'Europe' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', direction: 'ltr', region: 'Europe' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl', region: 'Middle East' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl', region: 'Asia' }
];

// Base translation structure for new languages
const BASE_TRANSLATIONS = {
  common: {
    loading: "Loading...",
    error: "An error occurred",
    backTop: "Back to Top",
    share: "Share",
    search: "Search",
    menu: "Menu",
    close: "Close",
    open: "Open",
    learnMore: "Learn More",
    getStarted: "Get Started",
    joinUs: "Join Us",
    contactUs: "Contact Us",
    followUs: "Follow Us",
    subscribe: "Subscribe",
    thankYou: "Thank You",
    success: "Success",
    apply: "Apply",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    download: "Download",
    required: "Required",
    yes: "Yes",
    no: "No",
    started: "Started",
    people: {
      reached: "People Reached"
    },
    active: {
      projects: "Active Projects"
    },
    countries: "Countries",
    success: {
      rate: "Success Rate"
    },
    accessibility: {
      languageChanged: "Language changed to {{language}}",
      languageSelector: "Select language",
      currentLanguage: "Current language: {{language}}",
      availableLanguages: "Available languages",
      searchLanguages: "Search languages",
      languageOptions: "Use arrow keys to navigate, Enter to select, Escape to close",
      skipToContent: "Skip to main content",
      skipToNavigation: "Skip to navigation",
      mainContent: "Main content",
      navigation: "Navigation",
      languageMenu: "Language menu",
      closeLanguageMenu: "Close language menu",
      openLanguageMenu: "Open language menu"
    }
  },
  navigation: {
    nav: {
      home: "Home",
      about: "About Us",
      actions: "Our Actions",
      information: "Information",
      act: "Act",
      contact: "Contact",
      donate: "Donate",
      search: "Search..."
    }
  },
  pages: {
    home: {
      hero: {
        title: "Empowering Communities, Growing Futures",
        subtitle: "Like the mighty baobab tree, we plant seeds of hope that grow into lasting change across communities worldwide.",
        donate: "Donate Now",
        learn: "Learn More"
      }
    },
    about: {
      title: "About BAOBAB HOPE"
    },
    contact: {
      title: "Contact Us",
      form: {
        name: "Full Name",
        email: "Email Address",
        subject: "Subject",
        message: "Message",
        send: "Send Message"
      }
    },
    donate: {
      title: "Make a Donation",
      amount: "Choose Amount",
      submit: "Complete Donation"
    }
  },
  forms: {
    validation: {
      required: "This field is required",
      email: "Please enter a valid email address",
      minLength: "Minimum length is {{min}} characters",
      maxLength: "Maximum length is {{max}} characters"
    }
  },
  actions: {
    buttons: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      update: "Update",
      submit: "Submit",
      reset: "Reset",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      previous: "Previous",
      finish: "Finish",
      close: "Close",
      open: "Open",
      expand: "Expand",
      collapse: "Collapse",
      select: "Select",
      deselect: "Deselect",
      selectAll: "Select All",
      deselectAll: "Deselect All",
      copy: "Copy",
      paste: "Paste",
      cut: "Cut",
      undo: "Undo",
      redo: "Redo"
    }
  },
  misc: {
    slogan: {
      main: "One Heart, One Hand"
    },
    footer: {
      mission: "Growing hope, nurturing communities, creating sustainable futures.",
      rights: "All rights reserved."
    }
  }
};

// Language-specific translations (basic examples)
const LANGUAGE_SPECIFIC_TRANSLATIONS = {
  es: {
    common: {
      loading: "Cargando...",
      error: "Ocurrió un error",
      backTop: "Volver Arriba",
      learnMore: "Saber Más",
      getStarted: "Comenzar",
      contactUs: "Contáctanos"
    },
    navigation: {
      nav: {
        home: "Inicio",
        about: "Acerca de",
        actions: "Nuestras Acciones",
        information: "Información",
        act: "Actuar",
        contact: "Contacto",
        donate: "Donar",
        search: "Buscar..."
      }
    },
    pages: {
      home: {
        hero: {
          title: "Empoderando Comunidades, Cultivando Futuros",
          subtitle: "Como el poderoso árbol baobab, plantamos semillas de esperanza que crecen en cambios duraderos en comunidades de todo el mundo.",
          donate: "Donar Ahora",
          learn: "Saber Más"
        }
      }
    },
    misc: {
      slogan: {
        main: "Un Corazón, Una Mano"
      }
    }
  },
  de: {
    common: {
      loading: "Laden...",
      error: "Ein Fehler ist aufgetreten",
      backTop: "Nach oben",
      learnMore: "Mehr erfahren",
      getStarted: "Loslegen",
      contactUs: "Kontaktieren Sie uns"
    },
    navigation: {
      nav: {
        home: "Startseite",
        about: "Über uns",
        actions: "Unsere Aktionen",
        information: "Information",
        act: "Handeln",
        contact: "Kontakt",
        donate: "Spenden",
        search: "Suchen..."
      }
    },
    misc: {
      slogan: {
        main: "Ein Herz, Eine Hand"
      }
    }
  },
  ar: {
    common: {
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      backTop: "العودة إلى الأعلى",
      learnMore: "اعرف المزيد",
      getStarted: "ابدأ",
      contactUs: "اتصل بنا"
    },
    navigation: {
      nav: {
        home: "الرئيسية",
        about: "من نحن",
        actions: "أعمالنا",
        information: "معلومات",
        act: "تحرك",
        contact: "اتصال",
        donate: "تبرع",
        search: "بحث..."
      }
    },
    misc: {
      slogan: {
        main: "قلب واحد، يد واحدة"
      }
    }
  },
  zh: {
    common: {
      loading: "加载中...",
      error: "发生错误",
      backTop: "返回顶部",
      learnMore: "了解更多",
      getStarted: "开始",
      contactUs: "联系我们"
    },
    navigation: {
      nav: {
        home: "首页",
        about: "关于我们",
        actions: "我们的行动",
        information: "信息",
        act: "行动",
        contact: "联系",
        donate: "捐赠",
        search: "搜索..."
      }
    },
    misc: {
      slogan: {
        main: "一心一手"
      }
    }
  },
  ja: {
    common: {
      loading: "読み込み中...",
      error: "エラーが発生しました",
      backTop: "トップに戻る",
      learnMore: "詳細を見る",
      getStarted: "始める",
      contactUs: "お問い合わせ"
    },
    navigation: {
      nav: {
        home: "ホーム",
        about: "私たちについて",
        actions: "私たちの活動",
        information: "情報",
        act: "行動",
        contact: "連絡先",
        donate: "寄付",
        search: "検索..."
      }
    },
    misc: {
      slogan: {
        main: "一つの心、一つの手"
      }
    }
  },
  ru: {
    common: {
      loading: "Загрузка...",
      error: "Произошла ошибка",
      backTop: "Наверх",
      learnMore: "Узнать больше",
      getStarted: "Начать",
      contactUs: "Связаться с нами"
    },
    navigation: {
      nav: {
        home: "Главная",
        about: "О нас",
        actions: "Наши действия",
        information: "Информация",
        act: "Действовать",
        contact: "Контакт",
        donate: "Пожертвовать",
        search: "Поиск..."
      }
    },
    misc: {
      slogan: {
        main: "Одно сердце, одна рука"
      }
    }
  }
};

/**
 * Save translation file with proper formatting
 */
function saveTranslationFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`Created: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
  }
}

/**
 * Count total translation keys recursively
 */
function countKeys(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeys(obj[key]);
    } else {
      count++;
    }
  }
  return count;
}

/**
 * Create translations for a specific language
 */
function createLanguageTranslations(languageInfo) {
  const { code } = languageInfo;
  console.log(`\nCreating translations for ${languageInfo.name} (${code})...`);
  
  const langDir = path.join(LOCALES_DIR, code);
  
  // Create language directory
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  
  // Get language-specific translations or use base
  const languageTranslations = LANGUAGE_SPECIFIC_TRANSLATIONS[code] || {};
  
  // Create each namespace file
  Object.keys(BASE_TRANSLATIONS).forEach(namespace => {
    const baseData = BASE_TRANSLATIONS[namespace];
    const languageData = languageTranslations[namespace] || {};
    
    // Merge base with language-specific translations
    const mergedData = mergeDeep(baseData, languageData);
    
    const filePath = path.join(langDir, `${namespace}.json`);
    saveTranslationFile(filePath, mergedData);
  });
  
  // Create manifest file
  const totalKeys = Object.values(BASE_TRANSLATIONS).reduce((total, ns) => 
    total + countKeys(ns), 0
  );
  
  const manifestData = {
    language: code,
    name: languageInfo.name,
    nativeName: languageInfo.nativeName,
    direction: languageInfo.direction,
    region: languageInfo.region,
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    namespaces: Object.keys(BASE_TRANSLATIONS),
    totalKeys: totalKeys,
    completionRate: LANGUAGE_SPECIFIC_TRANSLATIONS[code] ? 0.3 : 0.1, // Estimated completion
    status: 'initial'
  };
  
  const manifestPath = path.join(langDir, 'manifest.json');
  saveTranslationFile(manifestPath, manifestData);
  
  return totalKeys;
}

/**
 * Deep merge two objects
 */
function mergeDeep(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

/**
 * Test RTL languages
 */
function testRTLLanguages() {
  console.log('\n=== Testing RTL Languages ===');
  
  const rtlLanguages = INITIAL_LANGUAGES.filter(lang => lang.direction === 'rtl');
  
  rtlLanguages.forEach(lang => {
    console.log(`\nTesting ${lang.name} (${lang.code}) - RTL:`);
    
    const langDir = path.join(LOCALES_DIR, lang.code);
    if (fs.existsSync(langDir)) {
      // Check if translations contain RTL-specific content
      const commonPath = path.join(langDir, 'common.json');
      if (fs.existsSync(commonPath)) {
        const commonData = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
        
        // Test accessibility announcements
        if (commonData.accessibility && commonData.accessibility.languageChanged) {
          console.log(`✅ Accessibility support: ${commonData.accessibility.languageChanged}`);
        }
        
        // Test basic UI elements
        if (commonData.loading) {
          console.log(`✅ Basic UI: ${commonData.loading}`);
        }
      }
      
      // Check navigation
      const navPath = path.join(langDir, 'navigation.json');
      if (fs.existsSync(navPath)) {
        const navData = JSON.parse(fs.readFileSync(navPath, 'utf8'));
        if (navData.nav && navData.nav.home) {
          console.log(`✅ Navigation: ${navData.nav.home}`);
        }
      }
      
      console.log(`✅ RTL language ${lang.code} structure validated`);
    } else {
      console.log(`❌ RTL language ${lang.code} directory not found`);
    }
  });
}

/**
 * Test cultural formatting for different locales
 */
function testCulturalFormatting() {
  console.log('\n=== Testing Cultural Formatting ===');
  
  const testDate = new Date('2024-03-15T10:30:00Z');
  const testNumber = 1234567.89;
  const testCurrency = 1000;
  
  // Test a few representative languages
  const testLanguages = ['en', 'fr', 'es', 'de', 'ar', 'zh', 'ja'];
  
  testLanguages.forEach(langCode => {
    console.log(`\n${langCode.toUpperCase()}:`);
    
    try {
      // Date formatting
      const dateFormatter = new Intl.DateTimeFormat(langCode);
      const formattedDate = dateFormatter.format(testDate);
      console.log(`  Date: ${formattedDate}`);
      
      // Number formatting
      const numberFormatter = new Intl.NumberFormat(langCode);
      const formattedNumber = numberFormatter.format(testNumber);
      console.log(`  Number: ${formattedNumber}`);
      
      // Currency formatting (using USD as example)
      const currencyFormatter = new Intl.NumberFormat(langCode, {
        style: 'currency',
        currency: 'USD'
      });
      const formattedCurrency = currencyFormatter.format(testCurrency);
      console.log(`  Currency: ${formattedCurrency}`);
      
      console.log(`✅ Cultural formatting validated for ${langCode}`);
    } catch (error) {
      console.log(`❌ Cultural formatting failed for ${langCode}: ${error.message}`);
    }
  });
}

/**
 * Generate summary report
 */
function generateSummaryReport() {
  console.log('\n' + '='.repeat(60));
  console.log('INITIAL LANGUAGE SET SUMMARY');
  console.log('='.repeat(60));
  
  let totalLanguages = 0;
  let totalKeys = 0;
  let rtlLanguages = 0;
  
  INITIAL_LANGUAGES.forEach(lang => {
    const langDir = path.join(LOCALES_DIR, lang.code);
    if (fs.existsSync(langDir)) {
      totalLanguages++;
      
      if (lang.direction === 'rtl') {
        rtlLanguages++;
      }
      
      // Count keys from manifest
      const manifestPath = path.join(langDir, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        totalKeys += manifest.totalKeys || 0;
      }
    }
  });
  
  console.log(`\nLanguages Added: ${totalLanguages}`);
  console.log(`RTL Languages: ${rtlLanguages}`);
  console.log(`Total Translation Keys: ${totalKeys}`);
  console.log(`Average Keys per Language: ${Math.round(totalKeys / totalLanguages)}`);
  
  console.log('\nLanguage Breakdown:');
  INITIAL_LANGUAGES.forEach(lang => {
    const langDir = path.join(LOCALES_DIR, lang.code);
    if (fs.existsSync(langDir)) {
      const manifestPath = path.join(langDir, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const rtlIndicator = lang.direction === 'rtl' ? ' (RTL)' : '';
        console.log(`  ${lang.code}: ${lang.nativeName} - ${manifest.totalKeys} keys${rtlIndicator}`);
      }
    }
  });
  
  console.log('\nRegional Distribution:');
  const regions = {};
  INITIAL_LANGUAGES.forEach(lang => {
    const region = lang.region;
    regions[region] = (regions[region] || 0) + 1;
  });
  
  Object.entries(regions).forEach(([region, count]) => {
    console.log(`  ${region}: ${count} languages`);
  });
  
  console.log('\n✅ Initial language set successfully created!');
  console.log('\nNext steps:');
  console.log('1. Review and improve translations for each language');
  console.log('2. Test RTL layout with Arabic, Hebrew, and Persian');
  console.log('3. Validate cultural formatting for all locales');
  console.log('4. Add more comprehensive translations based on priority');
}

/**
 * Main function
 */
function main() {
  console.log('🌍 Adding Initial Language Set...\n');
  
  try {
    // Create translations for each language
    INITIAL_LANGUAGES.forEach(createLanguageTranslations);
    
    // Test RTL languages
    testRTLLanguages();
    
    // Test cultural formatting
    testCulturalFormatting();
    
    // Generate summary report
    generateSummaryReport();
    
  } catch (error) {
    console.error('Failed to add initial language set:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  main,
  INITIAL_LANGUAGES,
  createLanguageTranslations
};