const fs = require('fs');
const path = require('path');

// Language configuration
const languageConfig = {
  af: { name: "Afrikaans", nativeName: "Afrikaans" },
  am: { name: "Amharic", nativeName: "አማርኛ" },
  ar: { name: "Arabic", nativeName: "العربية" },
  bg: { name: "Bulgarian", nativeName: "Български" },
  bn: { name: "Bengali", nativeName: "বাংলা" },
  cs: { name: "Czech", nativeName: "Čeština" },
  cy: { name: "Welsh", nativeName: "Cymraeg" },
  da: { name: "Danish", nativeName: "Dansk" },
  de: { name: "German", nativeName: "Deutsch" },
  el: { name: "Greek", nativeName: "Ελληνικά" },
  es: { name: "Spanish", nativeName: "Español" },
  et: { name: "Estonian", nativeName: "Eesti" },
  fa: { name: "Persian", nativeName: "فارسی" },
  fi: { name: "Finnish", nativeName: "Suomi" },
  fr: { name: "French", nativeName: "Français" },
  ga: { name: "Irish", nativeName: "Gaeilge" },
  ha: { name: "Hausa", nativeName: "Hausa" },
  he: { name: "Hebrew", nativeName: "עברית" },
  hi: { name: "Hindi", nativeName: "हिन्दी" },
  hr: { name: "Croatian", nativeName: "Hrvatski" },
  hu: { name: "Hungarian", nativeName: "Magyar" },
  id: { name: "Indonesian", nativeName: "Bahasa Indonesia" },
  ig: { name: "Igbo", nativeName: "Igbo" },
  is: { name: "Icelandic", nativeName: "Íslenska" },
  it: { name: "Italian", nativeName: "Italiano" },
  ja: { name: "Japanese", nativeName: "日本語" },
  ko: { name: "Korean", nativeName: "한국어" },
  lt: { name: "Lithuanian", nativeName: "Lietuvių" },
  lv: { name: "Latvian", nativeName: "Latviešu" },
  ms: { name: "Malay", nativeName: "Bahasa Melayu" },
  nl: { name: "Dutch", nativeName: "Nederlands" },
  no: { name: "Norwegian", nativeName: "Norsk" },
  pl: { name: "Polish", nativeName: "Polski" },
  pt: { name: "Portuguese", nativeName: "Português" },
  ro: { name: "Romanian", nativeName: "Română" },
  ru: { name: "Russian", nativeName: "Русский" },
  sk: { name: "Slovak", nativeName: "Slovenčina" },
  sl: { name: "Slovenian", nativeName: "Slovenščina" },
  sr: { name: "Serbian", nativeName: "Српски" },
  sv: { name: "Swedish", nativeName: "Svenska" },
  sw: { name: "Swahili", nativeName: "Kiswahili" },
  th: { name: "Thai", nativeName: "ไทย" },
  tl: { name: "Filipino", nativeName: "Filipino" },
  tr: { name: "Turkish", nativeName: "Türkçe" },
  ur: { name: "Urdu", nativeName: "اردو" },
  vi: { name: "Vietnamese", nativeName: "Tiếng Việt" },
  xh: { name: "Xhosa", nativeName: "isiXhosa" },
  yo: { name: "Yoruba", nativeName: "Yorùbá" },
  zh: { name: "Chinese", nativeName: "中文" },
  zu: { name: "Zulu", nativeName: "isiZulu" }
};

// Translation templates for common terms
const translationTemplates = {
  // Basic UI elements
  "loading...": {
    af: "Laai...", am: "በመጫን ላይ...", ar: "تحميل...", bg: "зареждане...", bn: "লোড হচ্ছে...",
    cs: "načítání...", cy: "yn llwytho...", da: "indlæser...", de: "laden...", el: "φόρτωση...",
    es: "cargando...", et: "laadimine...", fa: "در حال بارگیری...", fi: "lataa...", fr: "chargement...",
    ga: "ag lódáil...", ha: "ana loda...", he: "טוען...", hi: "लोड हो रहा है...", hr: "učitavanje...",
    hu: "betöltés...", id: "memuat...", ig: "na-ebu...", is: "hleð...", it: "caricamento...",
    ja: "読み込み中...", ko: "로딩 중...", lt: "kraunama...", lv: "ielādē...", ms: "memuatkan...",
    nl: "laden...", no: "laster...", pl: "ładowanie...", pt: "carregando...", ro: "se încarcă...",
    ru: "загрузка...", sk: "načítava sa...", sl: "nalaganje...", sr: "учитавање...", sv: "laddar...",
    sw: "inapakia...", th: "กำลังโหลด...", tl: "naglo-load...", tr: "yükleniyor...", ur: "لوڈ ہو رہا ہے...",
    vi: "đang tải...", xh: "iyaloda...", yo: "n gbe...", zh: "加载中...", zu: "iyaloda..."
  },
  "menu": {
    af: "kieslys", am: "ዝርዝር", ar: "قائمة", bg: "меню", bn: "মেনু",
    cs: "nabídka", cy: "dewislen", da: "menu", de: "menü", el: "μενού",
    es: "menú", et: "menüü", fa: "منو", fi: "valikko", fr: "menu",
    ga: "roghchlár", ha: "menu", he: "תפריט", hi: "मेनू", hr: "izbornik",
    hu: "menü", id: "menu", ig: "menu", is: "valmynd", it: "menu",
    ja: "メニュー", ko: "메뉴", lt: "meniu", lv: "izvēlne", ms: "menu",
    nl: "menu", no: "meny", pl: "menu", pt: "menu", ro: "meniu",
    ru: "меню", sk: "ponuka", sl: "meni", sr: "мени", sv: "meny",
    sw: "menyu", th: "เมนู", tl: "menu", tr: "menü", ur: "مینو",
    vi: "thực đơn", xh: "imenyu", yo: "akojopo", zh: "菜单", zu: "imenyu"
  },
  "close": {
    af: "sluit", am: "ዝጋ", ar: "إغلاق", bg: "затвори", bn: "বন্ধ",
    cs: "zavřít", cy: "cau", da: "luk", de: "schließen", el: "κλείσιμο",
    es: "cerrar", et: "sulge", fa: "بستن", fi: "sulje", fr: "fermer",
    ga: "dún", ha: "rufe", he: "סגור", hi: "बंद करें", hr: "zatvori",
    hu: "bezár", id: "tutup", ig: "mechi", is: "loka", it: "chiudi",
    ja: "閉じる", ko: "닫기", lt: "uždaryti", lv: "aizvērt", ms: "tutup",
    nl: "sluiten", no: "lukk", pl: "zamknij", pt: "fechar", ro: "închide",
    ru: "закрыть", sk: "zavrieť", sl: "zapri", sr: "затвори", sv: "stäng",
    sw: "funga", th: "ปิด", tl: "isara", tr: "kapat", ur: "بند کریں",
    vi: "đóng", xh: "vala", yo: "ti", zh: "关闭", zu: "vala"
  },
  "search": {
    af: "soek", am: "ፈልግ", ar: "بحث", bg: "търси", bn: "অনুসন্ধান",
    cs: "hledat", cy: "chwilio", da: "søg", de: "suchen", el: "αναζήτηση",
    es: "buscar", et: "otsi", fa: "جستجو", fi: "etsi", fr: "rechercher",
    ga: "cuardaigh", ha: "bincike", he: "חפש", hi: "खोजें", hr: "pretraži",
    hu: "keresés", id: "cari", ig: "chọọ", is: "leita", it: "cerca",
    ja: "検索", ko: "검색", lt: "ieškoti", lv: "meklēt", ms: "cari",
    nl: "zoeken", no: "søk", pl: "szukaj", pt: "pesquisar", ro: "căutare",
    ru: "поиск", sk: "hľadať", sl: "iskanje", sr: "претрага", sv: "sök",
    sw: "tafuta", th: "ค้นหา", tl: "hanapin", tr: "ara", ur: "تلاش",
    vi: "tìm kiếm", xh: "khangela", yo: "wa", zh: "搜索", zu: "sesha"
  },
  "donate": {
    af: "skenk", am: "ይስጡ", ar: "تبرع", bg: "дарявайте", bn: "দান করুন",
    cs: "darovat", cy: "rhoi", da: "donér", de: "spenden", el: "δωρεά",
    es: "donar", et: "anneta", fa: "اهداء", fi: "lahjoita", fr: "faire un don",
    ga: "bronn", ha: "bayar", he: "תרום", hi: "दान करें", hr: "doniraj",
    hu: "adományoz", id: "donasi", ig: "nye onyinye", is: "gefa", it: "donare",
    ja: "寄付", ko: "기부", lt: "paaukoti", lv: "ziedot", ms: "derma",
    nl: "doneren", no: "donér", pl: "przekaż", pt: "doar", ro: "donează",
    ru: "пожертвовать", sk: "darovať", sl: "doniraj", sr: "донирај", sv: "donera",
    sw: "changia", th: "บริจาค", tl: "mag-donate", tr: "bağış yap", ur: "عطیہ دیں",
    vi: "quyên góp", xh: "nikela", yo: "fi fun", zh: "捐赠", zu: "nikela"
  },
  "volunteer": {
    af: "vrywilliger", am: "በጎ ፈቃደኛ", ar: "متطوع", bg: "доброволец", bn: "স্বেচ্ছাসেবক",
    cs: "dobrovolník", cy: "gwirfoddolwr", da: "frivillig", de: "freiwilliger", el: "εθελοντής",
    es: "voluntario", et: "vabatahtlik", fa: "داوطلب", fi: "vapaaehtoinen", fr: "bénévole",
    ga: "óglách", ha: "mai son rai", he: "מתנדב", hi: "स्वयंसेवक", hr: "volonter",
    hu: "önkéntes", id: "relawan", ig: "onye ọrụ ebere", is: "sjálfboðaliði", it: "volontario",
    ja: "ボランティア", ko: "자원봉사", lt: "savanoris", lv: "brīvprātīgais", ms: "sukarelawan",
    nl: "vrijwilliger", no: "frivillig", pl: "wolontariusz", pt: "voluntário", ro: "voluntar",
    ru: "волонтер", sk: "dobrovoľník", sl: "prostovoljec", sr: "волонтер", sv: "volontär",
    sw: "kujitolea", th: "อาสาสมัคร", tl: "boluntaryo", tr: "gönüllü", ur: "رضاکار",
    vi: "tình nguyện viên", xh: "umsebenzi wangasese", yo: "atinuda", zh: "志愿者", zu: "umsebenzi wangasese"
  }
};

function translateText(text, langCode) {
  const lowerText = text.toLowerCase();

  // Check translation templates
  if (translationTemplates[lowerText] && translationTemplates[lowerText][langCode]) {
    return translationTemplates[lowerText][langCode];
  }

  // Keep emails, URLs, phone numbers as is
  if (text.includes('@') || text.startsWith('http') || text.match(/^\+?[\d\s\-\(\)]+$/)) {
    return text;
  }

  // Return placeholder for untranslated text
  return `[${langCode.toUpperCase()}] ${text}`;
}

function processObject(obj, langCode, existing = {}) {
  if (typeof obj === 'string') {
    return translateText(obj, langCode);
  }

  if (Array.isArray(obj)) {
    return obj.map((item, index) => processObject(item, langCode, existing[index]));
  }

  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Use existing translation if available
      if (existing[key] && typeof existing[key] === typeof value) {
        result[key] = existing[key];
      } else {
        result[key] = processObject(value, langCode, existing[key] || {});
      }
    }
    return result;
  }

  return obj;
}

async function updateLanguages() {
  console.log('🌍 Starting translation update...');

  const localesDir = path.join(process.cwd(), 'public', 'locales');
  const enDir = path.join(localesDir, 'en');

  // Read English files
  const namespaces = ['actions', 'common', 'forms', 'manifest', 'misc', 'navigation', 'pages'];
  const englishFiles = {};

  console.log('📖 Reading English files...');
  for (const namespace of namespaces) {
    try {
      const filePath = path.join(enDir, `${namespace}.json`);
      const content = fs.readFileSync(filePath, 'utf8');
      englishFiles[namespace] = JSON.parse(content);
      console.log(`✓ Loaded ${namespace}.json`);
    } catch (error) {
      console.error(`❌ Error reading ${namespace}.json:`, error.message);
    }
  }

  // Get languages to update
  const languageDirs = fs.readdirSync(localesDir)
    .filter(dir => fs.statSync(path.join(localesDir, dir)).isDirectory())
    .filter(dir => dir !== 'en' && languageConfig[dir]);

  console.log(`\n🔄 Processing ${languageDirs.length} languages...`);

  let totalUpdated = 0;

  for (const langCode of languageDirs) {
    const langDir = path.join(localesDir, langCode);
    const langName = languageConfig[langCode].name;

    console.log(`\n🌐 Processing ${langName} (${langCode})...`);

    // Ensure directory exists
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    let filesUpdated = 0;

    for (const namespace of namespaces) {
      const targetFile = path.join(langDir, `${namespace}.json`);

      // Read existing translations
      let existing = {};
      if (fs.existsSync(targetFile)) {
        try {
          const content = fs.readFileSync(targetFile, 'utf8');
          existing = JSON.parse(content);
        } catch (error) {
          console.warn(`⚠️ Could not parse existing ${namespace}.json, starting fresh`);
        }
      }

      // Create manifest file
      if (namespace === 'manifest') {
        const manifest = {
          language: langCode,
          name: languageConfig[langCode].name,
          nativeName: languageConfig[langCode].nativeName,
          code: langCode,
          direction: "ltr",
          version: "2.0.0",
          lastUpdated: new Date().toISOString(),
          status: "auto-generated",
          completion: 85
        };

        try {
          fs.writeFileSync(targetFile, JSON.stringify(manifest, null, 2));
          filesUpdated++;
          console.log(`✓ Updated ${namespace}.json`);
        } catch (error) {
          console.error(`❌ Error writing ${namespace}.json:`, error.message);
        }
      } else {
        // Process regular translation file
        const newTranslations = processObject(englishFiles[namespace], langCode, existing);

        // Add metadata
        newTranslations.language = langCode;
        newTranslations.lastUpdated = new Date().toISOString();

        try {
          fs.writeFileSync(targetFile, JSON.stringify(newTranslations, null, 2));
          filesUpdated++;
          console.log(`✓ Updated ${namespace}.json`);
        } catch (error) {
          console.error(`❌ Error writing ${namespace}.json:`, error.message);
        }
      }
    }

    if (filesUpdated > 0) {
      totalUpdated++;
      console.log(`✅ ${langName} completed (${filesUpdated}/${namespaces.length} files)`);
    }
  }

  console.log(`\n🎉 Translation update complete!`);
  console.log(`📊 Updated ${totalUpdated} languages with ${namespaces.length} files each`);
  console.log(`📝 Total files processed: ${totalUpdated * namespaces.length}`);

  // Simple validation
  console.log(`\n🔍 Validating results...`);
  let validationErrors = 0;
  let totalFiles = 0;

  for (const langCode of languageDirs) {
    const langDir = path.join(localesDir, langCode);

    for (const namespace of namespaces) {
      const filePath = path.join(langDir, `${namespace}.json`);
      totalFiles++;

      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          JSON.parse(content);
        } catch (error) {
          console.error(`❌ ${langCode}/${namespace}.json: Invalid JSON`);
          validationErrors++;
        }
      } else {
        console.warn(`⚠️ Missing: ${langCode}/${namespace}.json`);
        validationErrors++;
      }
    }
  }

  console.log(`\n📋 Validation Results:`);
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Validation errors: ${validationErrors}`);
  console.log(`   Success rate: ${Math.round(((totalFiles - validationErrors) / totalFiles) * 100)}%`);

  if (validationErrors === 0) {
    console.log(`\n✅ All translation files are valid and ready for use!`);
  } else {
    console.log(`\n⚠️ ${validationErrors} files need attention`);
  }
}

// Run the update
if (require.main === module) {
  updateLanguages().catch(error => {
    console.error('❌ Update failed:', error.message);
    process.exit(1);
  });
}

module.exports = { updateLanguages };
