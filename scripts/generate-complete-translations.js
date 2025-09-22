#!/usr/bin/env node

/**
 * Generate Complete Translations Script
 * 
 * This script creates comprehensive translation files for all languages
 * by copying the structure from English and providing proper translations
 */

const fs = require('fs')
const path = require('path')

const localesDir = path.join(process.cwd(), 'public', 'locales')

// Read the complete English translations as base
function readEnglishTranslations() {
  const enDir = path.join(localesDir, 'en')
  const translations = {}
  
  const files = ['navigation.json', 'common.json', 'pages.json', 'actions.json']
  
  files.forEach(file => {
    const filePath = path.join(enDir, file)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      const chunk = file.replace('.json', '')
      translations[chunk] = JSON.parse(content)
    }
  })
  
  return translations
}

// Comprehensive translations for each language
const translations = {
  es: { // Spanish
    // Navigation
    nav: {
      home: "Inicio",
      about: {
        title: "Acerca de",
        history: "Historia",
        missions: "Misiones",
        organizations: "Organizaciones",
        regions: "Regiones",
        localGroups: "Grupos Locales",
        partnerNetworks: "Redes de Socios",
        financialTransparency: "Transparencia Financiera"
      },
      aboutTitle: "Acerca de",
      actions: "Nuestras Acciones",
      information: {
        title: "Información",
        agenda: "Calendario",
        advertising: "Publicidad",
        resources: "Recursos",
        press: "Área de Prensa",
        podcast: "Podcast",
        analysis: "Análisis",
        faq: "FAQ"
      },
      informationTitle: "Información",
      act: {
        title: "Actuar",
        volunteering: "Voluntariado",
        campaigns: "Nuestras Campañas",
        training: "Formación",
        jobs: "Ofertas de Empleo",
        partners: "Socios",
        legacy: "Legado",
        lifeInsurance: "Seguro de Vida",
        donation: "Donación"
      },
      actTitle: "Actuar",
      contact: "Contacto",
      donate: "Donar",
      search: "Buscar..."
    },
    
    // Common
    slogan: { main: "Un Corazón, Una Mano" },
    common: {
      loading: "Cargando...",
      error: "Ocurrió un error",
      backTop: "Volver Arriba",
      share: "Compartir",
      search: "Buscar",
      menu: "Menú",
      close: "Cerrar",
      open: "Abrir",
      learnMore: "Saber Más",
      getStarted: "Comenzar",
      joinUs: "Únete a Nosotros",
      contactUs: "Contáctanos",
      followUs: "Síguenos",
      subscribe: "Suscribirse",
      thankYou: "Gracias",
      success: "Éxito",
      apply: "Aplicar",
      submit: "Enviar",
      cancel: "Cancelar",
      save: "Guardar",
      download: "Descargar",
      required: "Requerido",
      yes: "Sí",
      no: "No",
      started: "Iniciado",
      people: { reached: "Personas Alcanzadas" },
      active: { projects: "Proyectos Activos" },
      countries: "Países",
      successRate: "Tasa de Éxito"
    },
    
    // Pages
    home: {
      hero: {
        title: "Empoderando Comunidades, Cultivando Futuros",
        subtitle: "Como el poderoso árbol baobab, plantamos semillas de esperanza que crecen en cambios duraderos en comunidades de todo el mundo.",
        donate: "Donar Ahora",
        learn: "Saber Más",
        education: {
          title: "Empoderando a Través de la Educación",
          subtitle: "Construyendo Futuros Más Brillantes",
          description: "Apoyando programas de alfabetización e iniciativas educativas que transforman comunidades y crean oportunidades duraderas de crecimiento.",
          cta: "Explorar Proyectos Educativos"
        },
        environment: {
          title: "Protegiendo Nuestro Planeta",
          subtitle: "Conservación Ambiental",
          description: "Implementando prácticas sostenibles y esfuerzos de conservación para preservar ecosistemas para futuras generaciones mientras empoderamos comunidades locales.",
          cta: "Conocer Nuestro Impacto"
        },
        healthcare: {
          title: "Atención Médica para Todos",
          subtitle: "Bienestar Comunitario",
          description: "Proporcionando servicios de salud esenciales y educación sanitaria a comunidades desatendidas, asegurando que todos tengan acceso a atención médica de calidad.",
          cta: "Ver Proyectos de Salud"
        }
      },
      impact: {
        title: "Nuestro Impacto Creciente",
        people: "Vidas Transformadas",
        projects: "Proyectos Activos",
        countries: "Países Alcanzados",
        volunteers: "Voluntarios"
      }
    }
  },
  
  de: { // German
    nav: {
      home: "Startseite",
      about: {
        title: "Über uns",
        history: "Geschichte",
        missions: "Missionen",
        organizations: "Organisationen",
        regions: "Regionen",
        localGroups: "Lokale Gruppen",
        partnerNetworks: "Partner-Netzwerke",
        financialTransparency: "Finanzielle Transparenz"
      },
      aboutTitle: "Über uns",
      actions: "Unsere Aktionen",
      information: {
        title: "Information",
        agenda: "Kalender",
        advertising: "Werbung",
        resources: "Ressourcen",
        press: "Pressebereich",
        podcast: "Podcast",
        analysis: "Analyse",
        faq: "FAQ"
      },
      informationTitle: "Information",
      act: {
        title: "Handeln",
        volunteering: "Freiwilligenarbeit",
        campaigns: "Unsere Kampagnen",
        training: "Ausbildung",
        jobs: "Stellenangebote",
        partners: "Partner",
        legacy: "Vermächtnis",
        lifeInsurance: "Lebensversicherung",
        donation: "Spende"
      },
      actTitle: "Handeln",
      contact: "Kontakt",
      donate: "Spenden",
      search: "Suchen..."
    },
    slogan: { main: "Ein Herz, Eine Hand" },
    common: {
      loading: "Laden...",
      error: "Ein Fehler ist aufgetreten",
      backTop: "Nach oben",
      share: "Teilen",
      search: "Suchen",
      menu: "Menü",
      close: "Schließen",
      open: "Öffnen",
      learnMore: "Mehr erfahren",
      getStarted: "Loslegen",
      joinUs: "Mach mit",
      contactUs: "Kontaktiere uns",
      followUs: "Folge uns",
      subscribe: "Abonnieren",
      thankYou: "Danke",
      success: "Erfolg",
      apply: "Bewerben",
      submit: "Senden",
      cancel: "Abbrechen",
      save: "Speichern",
      download: "Herunterladen",
      required: "Erforderlich",
      yes: "Ja",
      no: "Nein",
      started: "Gestartet",
      people: { reached: "Erreichte Menschen" },
      active: { projects: "Aktive Projekte" },
      countries: "Länder",
      successRate: "Erfolgsrate"
    },
    home: {
      hero: {
        title: "Gemeinschaften stärken, Zukunft gestalten",
        subtitle: "Wie der mächtige Baobab-Baum pflanzen wir Samen der Hoffnung, die zu dauerhaftem Wandel in Gemeinschaften weltweit heranwachsen.",
        donate: "Jetzt spenden",
        learn: "Mehr erfahren",
        education: {
          title: "Stärkung durch Bildung",
          subtitle: "Hellere Zukunft schaffen",
          description: "Unterstützung von Alphabetisierungsprogrammen und Bildungsinitiativen, die Gemeinschaften transformieren und dauerhafte Wachstumschancen schaffen.",
          cta: "Bildungsprojekte erkunden"
        }
      }
    }
  },
  
  it: { // Italian
    nav: {
      home: "Home",
      about: {
        title: "Chi siamo",
        history: "Storia",
        missions: "Missioni",
        organizations: "Organizzazioni",
        regions: "Regioni",
        localGroups: "Gruppi Locali",
        partnerNetworks: "Reti Partner",
        financialTransparency: "Trasparenza Finanziaria"
      },
      aboutTitle: "Chi siamo",
      actions: "Le nostre azioni",
      information: {
        title: "Informazioni",
        agenda: "Calendario",
        advertising: "Pubblicità",
        resources: "Risorse",
        press: "Area Stampa",
        podcast: "Podcast",
        analysis: "Analisi",
        faq: "FAQ"
      },
      informationTitle: "Informazioni",
      act: {
        title: "Agire",
        volunteering: "Volontariato",
        campaigns: "Le nostre campagne",
        training: "Formazione",
        jobs: "Offerte di lavoro",
        partners: "Partner",
        legacy: "Eredità",
        lifeInsurance: "Assicurazione vita",
        donation: "Donazione"
      },
      actTitle: "Agire",
      contact: "Contatto",
      donate: "Dona",
      search: "Cerca..."
    },
    slogan: { main: "Un Cuore, Una Mano" },
    common: {
      loading: "Caricamento...",
      error: "Si è verificato un errore",
      backTop: "Torna su",
      share: "Condividi",
      search: "Cerca",
      menu: "Menu",
      close: "Chiudi",
      open: "Apri",
      learnMore: "Scopri di più",
      getStarted: "Inizia",
      joinUs: "Unisciti a noi",
      contactUs: "Contattaci",
      followUs: "Seguici",
      subscribe: "Iscriviti",
      thankYou: "Grazie",
      success: "Successo",
      apply: "Applica",
      submit: "Invia",
      cancel: "Annulla",
      save: "Salva",
      download: "Scarica",
      required: "Richiesto",
      yes: "Sì",
      no: "No",
      started: "Iniziato",
      people: { reached: "Persone Raggiunte" },
      active: { projects: "Progetti Attivi" },
      countries: "Paesi",
      successRate: "Tasso di Successo"
    },
    home: {
      hero: {
        title: "Potenziare le Comunità, Coltivare il Futuro",
        subtitle: "Come il possente albero baobab, piantiamo semi di speranza che crescono in cambiamenti duraturi nelle comunità di tutto il mondo.",
        donate: "Dona Ora",
        learn: "Scopri di Più"
      }
    }
  },
  
  pt: { // Portuguese
    nav: {
      home: "Início",
      about: {
        title: "Sobre nós",
        history: "História",
        missions: "Missões",
        organizations: "Organizações",
        regions: "Regiões",
        localGroups: "Grupos Locais",
        partnerNetworks: "Redes Parceiras",
        financialTransparency: "Transparência Financeira"
      },
      aboutTitle: "Sobre nós",
      actions: "Nossas Ações",
      information: {
        title: "Informação",
        agenda: "Calendário",
        advertising: "Publicidade",
        resources: "Recursos",
        press: "Área de Imprensa",
        podcast: "Podcast",
        analysis: "Análise",
        faq: "FAQ"
      },
      informationTitle: "Informação",
      act: {
        title: "Agir",
        volunteering: "Voluntariado",
        campaigns: "Nossas campanhas",
        training: "Treinamento",
        jobs: "Ofertas de emprego",
        partners: "Parceiros",
        legacy: "Legado",
        lifeInsurance: "Seguro de vida",
        donation: "Doação"
      },
      actTitle: "Agir",
      contact: "Contato",
      donate: "Doar",
      search: "Pesquisar..."
    },
    slogan: { main: "Um Coração, Uma Mão" },
    common: {
      loading: "Carregando...",
      error: "Ocorreu um erro",
      backTop: "Voltar ao Topo",
      share: "Compartilhar",
      search: "Pesquisar",
      menu: "Menu",
      close: "Fechar",
      open: "Abrir",
      learnMore: "Saiba Mais",
      getStarted: "Começar",
      joinUs: "Junte-se a Nós",
      contactUs: "Entre em Contato",
      followUs: "Siga-nos",
      subscribe: "Inscrever-se",
      thankYou: "Obrigado",
      success: "Sucesso",
      apply: "Aplicar",
      submit: "Enviar",
      cancel: "Cancelar",
      save: "Salvar",
      download: "Baixar",
      required: "Obrigatório",
      yes: "Sim",
      no: "Não",
      started: "Iniciado",
      people: { reached: "Pessoas Alcançadas" },
      active: { projects: "Projetos Ativos" },
      countries: "Países",
      successRate: "Taxa de Sucesso"
    },
    home: {
      hero: {
        title: "Capacitando Comunidades, Cultivando Futuros",
        subtitle: "Como a poderosa árvore baobá, plantamos sementes de esperança que crescem em mudanças duradouras em comunidades ao redor do mundo.",
        donate: "Doe Agora",
        learn: "Saiba Mais"
      }
    }
  }
}

// Function to recursively merge translations with English base
function mergeWithEnglishBase(englishData, translationData, path = '') {
  const result = {}
  
  for (const [key, value] of Object.entries(englishData)) {
    const currentPath = path ? `${path}.${key}` : key
    
    if (translationData && translationData[key]) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursively merge nested objects
        result[key] = mergeWithEnglishBase(value, translationData[key], currentPath)
      } else {
        // Use translation if available
        result[key] = translationData[key]
      }
    } else {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Keep English structure but try to translate nested items
        result[key] = mergeWithEnglishBase(value, {}, currentPath)
      } else {
        // Fallback to English if no translation available
        result[key] = value
      }
    }
  }
  
  return result
}

// Generate complete translations for each language
function generateCompleteTranslations() {
  console.log('🌍 Generating complete translations...\n')
  
  const englishTranslations = readEnglishTranslations()
  
  Object.entries(translations).forEach(([langCode, langTranslations]) => {
    console.log(`📝 Processing ${langCode}...`)
    
    const langDir = path.join(localesDir, langCode)
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true })
    }
    
    // Generate each chunk
    Object.entries(englishTranslations).forEach(([chunkName, englishChunk]) => {
      let translatedChunk
      
      if (chunkName === 'navigation') {
        translatedChunk = {
          nav: langTranslations.nav || englishChunk.nav,
          footer: englishChunk.footer // Keep English footer for now
        }
      } else if (chunkName === 'common') {
        translatedChunk = {
          slogan: langTranslations.slogan || englishChunk.slogan,
          common: langTranslations.common || englishChunk.common,
          accessibility: englishChunk.accessibility // Keep English accessibility
        }
      } else {
        // For other chunks, merge with English base
        translatedChunk = mergeWithEnglishBase(englishChunk, langTranslations)
      }
      
      const filePath = path.join(langDir, `${chunkName}.json`)
      fs.writeFileSync(filePath, JSON.stringify(translatedChunk, null, 2))
      console.log(`  ✅ Created ${chunkName}.json`)
    })
  })
  
  console.log('\n🎉 Complete translations generated successfully!')
}

// Run the generation
generateCompleteTranslations()