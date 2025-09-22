#!/usr/bin/env node

/**
 * Create Basic Translations Script
 * 
 * This script creates basic translation files for key languages
 * using the English translations as a base and providing basic translations
 */

const fs = require('fs')
const path = require('path')

// Basic translations for key navigation items
const basicTranslations = {
  es: { // Spanish
    nav: {
      home: "Inicio",
      about: { title: "Acerca de" },
      actions: "Nuestras Acciones", 
      information: { title: "Información" },
      act: { title: "Actuar" },
      contact: "Contacto",
      donate: "Donar"
    },
    slogan: { main: "Un Corazón, Una Mano" },
    common: {
      loading: "Cargando...",
      menu: "Menú",
      close: "Cerrar",
      search: "Buscar"
    }
  },
  de: { // German
    nav: {
      home: "Startseite",
      about: { title: "Über uns" },
      actions: "Unsere Aktionen",
      information: { title: "Information" },
      act: { title: "Handeln" },
      contact: "Kontakt", 
      donate: "Spenden"
    },
    slogan: { main: "Ein Herz, Eine Hand" },
    common: {
      loading: "Laden...",
      menu: "Menü",
      close: "Schließen",
      search: "Suchen"
    }
  },
  it: { // Italian
    nav: {
      home: "Home",
      about: { title: "Chi siamo" },
      actions: "Le nostre azioni",
      information: { title: "Informazioni" },
      act: { title: "Agire" },
      contact: "Contatto",
      donate: "Dona"
    },
    slogan: { main: "Un Cuore, Una Mano" },
    common: {
      loading: "Caricamento...",
      menu: "Menu",
      close: "Chiudi",
      search: "Cerca"
    }
  },
  pt: { // Portuguese
    nav: {
      home: "Início",
      about: { title: "Sobre nós" },
      actions: "Nossas Ações",
      information: { title: "Informação" },
      act: { title: "Agir" },
      contact: "Contato",
      donate: "Doar"
    },
    slogan: { main: "Um Coração, Uma Mão" },
    common: {
      loading: "Carregando...",
      menu: "Menu",
      close: "Fechar",
      search: "Pesquisar"
    }
  },
  ar: { // Arabic
    nav: {
      home: "الرئيسية",
      about: { title: "من نحن" },
      actions: "أعمالنا",
      information: { title: "معلومات" },
      act: { title: "اتخذ إجراء" },
      contact: "اتصل بنا",
      donate: "تبرع"
    },
    slogan: { main: "قلب واحد، يد واحدة" },
    common: {
      loading: "جاري التحميل...",
      menu: "القائمة",
      close: "إغلاق",
      search: "بحث"
    }
  },
  zh: { // Chinese
    nav: {
      home: "首页",
      about: { title: "关于我们" },
      actions: "我们的行动",
      information: { title: "信息" },
      act: { title: "采取行动" },
      contact: "联系我们",
      donate: "捐赠"
    },
    slogan: { main: "一心一手" },
    common: {
      loading: "加载中...",
      menu: "菜单",
      close: "关闭",
      search: "搜索"
    }
  },
  ru: { // Russian
    nav: {
      home: "Главная",
      about: { title: "О нас" },
      actions: "Наши действия",
      information: { title: "Информация" },
      act: { title: "Действовать" },
      contact: "Контакты",
      donate: "Пожертвовать"
    },
    slogan: { main: "Одно сердце, одна рука" },
    common: {
      loading: "Загрузка...",
      menu: "Меню",
      close: "Закрыть",
      search: "Поиск"
    }
  },
  ja: { // Japanese
    nav: {
      home: "ホーム",
      about: { title: "私たちについて" },
      actions: "私たちの活動",
      information: { title: "情報" },
      act: { title: "行動する" },
      contact: "お問い合わせ",
      donate: "寄付"
    },
    slogan: { main: "一つの心、一つの手" },
    common: {
      loading: "読み込み中...",
      menu: "メニュー",
      close: "閉じる",
      search: "検索"
    }
  }
}

const localesDir = path.join(process.cwd(), 'public', 'locales')

console.log('🌍 Creating basic translations for key languages...\n')

Object.entries(basicTranslations).forEach(([langCode, translations]) => {
  const langDir = path.join(localesDir, langCode)
  
  // Create language directory if it doesn't exist
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true })
  }
  
  // Create navigation.json
  const navData = {
    nav: translations.nav,
    footer: {
      mission: "Growing hope, nurturing communities, creating sustainable futures.",
      links: "Quick Links",
      contact: "Contact Info",
      rights: "All rights reserved."
    }
  }
  
  fs.writeFileSync(
    path.join(langDir, 'navigation.json'),
    JSON.stringify(navData, null, 2)
  )
  
  // Create common.json
  const commonData = {
    slogan: translations.slogan,
    common: translations.common,
    accessibility: {
      languageChanged: `Language changed to {{language}}`,
      languageSelector: "Select language",
      currentLanguage: "Current language: {{language}}",
      availableLanguages: "Available languages"
    }
  }
  
  fs.writeFileSync(
    path.join(langDir, 'common.json'),
    JSON.stringify(commonData, null, 2)
  )
  
  // Create basic pages.json
  const pagesData = {
    home: {
      hero: {
        title: "Empowering Communities, Growing Futures",
        subtitle: "Like the mighty baobab tree, we plant seeds of hope that grow into lasting change across communities worldwide."
      }
    }
  }
  
  fs.writeFileSync(
    path.join(langDir, 'pages.json'),
    JSON.stringify(pagesData, null, 2)
  )
  
  console.log(`✅ Created basic translations for ${langCode}`)
})

console.log('\n🎉 Basic translations created successfully!')
console.log('\n📝 Note: These are basic translations. For production, use professional translation services.')