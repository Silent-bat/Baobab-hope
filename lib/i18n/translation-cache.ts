import { LRUCache } from 'lru-cache';

// Configuration du cache avancé pour des performances instantanées
const CACHE_CONFIG = {
  max: 1000, // Nombre maximum d'entrées en cache
  ttl: 1000 * 60 * 60, // 1 heure de durée de vie
  updateAgeOnGet: true, // Met à jour l'âge à chaque accès
  updateAgeOnHas: false, // Ne met pas à jour l'âge lors des vérifications d'existence
  allowStale: true, // Permet de retourner des données périmées si le calcul est en cours
  dispose: (value: any, key: string) => {
    // Nettoyage personnalisé lors de la suppression du cache
    console.debug(`Cache: Supprimé ${key}`);
  },
  noDisposeOnSet: false, // Permet le nettoyage automatique
  fetchMethod: async (key: string) => {
    // Méthode de récupération asynchrone pour les données manquantes
    return await loadTranslationData(key);
  }
};

// Cache principal pour les traductions
const translationCache = new LRUCache(CACHE_CONFIG);

// Cache pour les traductions compilées (optimisé pour la production)
const compiledCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 30, // 30 minutes
  updateAgeOnGet: true
});

// Cache pour les métadonnées des langues
const metadataCache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 60 * 24, // 24 heures
  updateAgeOnGet: true
});

// Interface pour les données de traduction
interface TranslationData {
  [namespace: string]: any;
}

interface CompiledTranslation {
  flat: Map<string, string>;
  hierarchical: any;
  version: string;
  lastModified: number;
}

// Fonction pour charger les données de traduction
async function loadTranslationData(key: string): Promise<TranslationData> {
  const [language, namespace] = key.split(':');
  const fs = require('fs').promises;
  const path = require('path');

  try {
    const filePath = path.join(process.cwd(), 'public/locales', language, `${namespace}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    // Mettre à jour le cache des métadonnées
    const metadataKey = `metadata:${language}`;
    if (!metadataCache.has(metadataKey)) {
      metadataCache.set(metadataKey, {
        version: data.version || '1.0.0',
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        totalKeys: countTranslationKeys(data)
      });
    }

    return { [namespace]: data };
  } catch (error) {
    console.error(`Erreur lors du chargement de ${key}:`, error);
    return {};
  }
}

// Fonction pour compter les clés de traduction
function countTranslationKeys(obj: any): number {
  let count = 0;
  function traverse(o: any) {
    for (const key in o) {
      if (typeof o[key] === 'object' && o[key] !== null) {
        traverse(o[key]);
      } else {
        count++;
      }
    }
  }
  traverse(obj);
  return count;
}

// Fonction pour aplatir les traductions hiérarchiques
function flattenTranslations(obj: any, prefix = ''): Map<string, string> {
  const flat = new Map<string, string>();

  function traverse(o: any, path = '') {
    for (const key in o) {
      if (typeof o[key] === 'object' && o[key] !== null) {
        traverse(o[key], path ? `${path}.${key}` : key);
      } else {
        flat.set(path ? `${path}.${key}` : key, String(o[key]));
      }
    }
  }

  traverse(obj);
  return flat;
}

// Fonction pour compiler les traductions d'une langue
async function compileLanguageTranslations(language: string): Promise<CompiledTranslation> {
  const cacheKey = `compiled:${language}`;
  const cached = compiledCache.get(cacheKey) as CompiledTranslation | undefined;

  if (cached) {
    return cached;
  }

  const translationData: TranslationData = {};
  const promises = ['common', 'navigation', 'pages', 'forms', 'actions', 'misc', 'manifest'].map(async (namespace) => {
    const cacheKey = `${language}:${namespace}`;
    const data = translationCache.get(cacheKey) || await loadTranslationData(cacheKey);
    if (data[namespace]) {
      translationData[namespace] = data[namespace];
    }
  });

  await Promise.all(promises);

  const hierarchical = Object.assign({}, ...Object.values(translationData));
  const flat = flattenTranslations(hierarchical);

  const compiled: CompiledTranslation = {
    flat,
    hierarchical,
    version: '2.0.0',
    lastModified: Date.now()
  };

  compiledCache.set(cacheKey, compiled);
  return compiled;
}

// API du cache de traduction
export const TranslationCache = {
  // Récupérer une traduction spécifique
  get: async (language: string, namespace: string, key: string): Promise<string | null> => {
    const cacheKey = `${language}:${namespace}`;
    let data = translationCache.get(cacheKey);

    if (!data) {
      data = await loadTranslationData(cacheKey);
      if (Object.keys(data).length > 0) {
        translationCache.set(cacheKey, data);
      }
    }

    if (data[namespace]) {
      const keys = key.split('.');
      let value = data[namespace];
      for (const k of keys) {
        value = value?.[k];
      }
      return value || null;
    }

    return null;
  },

  // Récupérer toutes les traductions d'une langue (optimisé)
  getAll: async (language: string): Promise<CompiledTranslation> => {
    return await compileLanguageTranslations(language);
  },

  // Récupérer une traduction aplatie (plus rapide)
  getFlat: async (language: string, key: string): Promise<string | null> => {
    const compiled = await compileLanguageTranslations(language);
    return compiled.flat.get(key) || null;
  },

  // Vérifier si une langue existe en cache
  has: (language: string, namespace: string): boolean => {
    const cacheKey = `${language}:${namespace}`;
    return translationCache.has(cacheKey);
  },

  // Invalider le cache d'une langue
  invalidate: (language: string): void => {
    const cacheKey = `compiled:${language}`;
    compiledCache.delete(cacheKey);

    // Invalider tous les namespaces de cette langue
    const keys = translationCache.keys();
    keys.forEach(key => {
      if (key.startsWith(`${language}:`)) {
        translationCache.delete(key);
      }
    });

    // Invalider les métadonnées
    metadataCache.delete(`metadata:${language}`);
  },

  // Obtenir les statistiques du cache
  getStats: () => {
    return {
      translationCache: {
        size: translationCache.size,
        maxSize: translationCache.max,
        calculatedSize: translationCache.calculatedSize
      },
      compiledCache: {
        size: compiledCache.size,
        maxSize: compiledCache.max
      },
      metadataCache: {
        size: metadataCache.size,
        maxSize: metadataCache.max
      }
    };
  },

  // Précharger les langues les plus utilisées
  preload: async (languages: string[]): Promise<void> => {
    const promises = languages.map(lang => compileLanguageTranslations(lang));
    await Promise.allSettled(promises);
  },

  // Nettoyer le cache
  clear: (): void => {
    translationCache.clear();
    compiledCache.clear();
    metadataCache.clear();
  }
};

export default TranslationCache;