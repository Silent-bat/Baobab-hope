import TranslationCache from './translation-cache';
import { I18N_CONFIG } from './config';

// Interface pour les options de traduction
interface TranslationOptions {
  fallbackLanguage?: string;
  returnKeyIfNotFound?: boolean;
  namespace?: string;
}

// Interface pour les traductions compilées
interface CompiledTranslations {
  [language: string]: {
    flat: Map<string, string>;
    hierarchical: any;
    version: string;
  };
}

// Service de traduction optimisé pour des performances instantanées
class OptimizedTranslationService {
  private compiledTranslations: CompiledTranslations = {};
  private preloadedLanguages: Set<string> = new Set();

  constructor() {
    // Précharger les langues principales au démarrage
    this.preloadCoreLanguages();
  }

  // Précharger les langues principales pour des performances optimales
  private async preloadCoreLanguages(): Promise<void> {
    const coreLanguages = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'zh', 'ru', 'ja'];

    try {
      await TranslationCache.preload(coreLanguages);
      coreLanguages.forEach(lang => this.preloadedLanguages.add(lang));
      console.log('✅ Langues principales préchargées pour des performances optimales');
    } catch (error) {
      console.error('Erreur lors du préchargement des langues:', error);
    }
  }

  // Traduire une clé avec optimisation du cache
  async translate(
    language: string,
    key: string,
    options: TranslationOptions = {}
  ): Promise<string> {
    const {
      fallbackLanguage = I18N_CONFIG.fallbackLanguage,
      returnKeyIfNotFound = false,
      namespace = 'common'
    } = options;

    // Vérifier d'abord le cache aplati (plus rapide)
    try {
      const flatTranslation = await TranslationCache.getFlat(language, key);
      if (flatTranslation) {
        return flatTranslation;
      }
    } catch (error) {
      console.debug(`Cache miss pour ${language}:${key}`);
    }

    // Fallback vers le cache hiérarchique
    try {
      const translation = await TranslationCache.get(language, namespace, key);
      if (translation) {
        return translation;
      }
    } catch (error) {
      console.debug(`Traduction manquante: ${language}:${namespace}:${key}`);
    }

    // Fallback vers la langue de fallback si spécifiée
    if (fallbackLanguage && fallbackLanguage !== language) {
      try {
        const fallbackTranslation = await TranslationCache.getFlat(fallbackLanguage, key);
        if (fallbackTranslation) {
          return fallbackTranslation;
        }
      } catch (error) {
        console.debug(`Traduction de fallback manquante: ${fallbackLanguage}:${key}`);
      }
    }

    // Retourner la clé si demandé, sinon une chaîne vide
    return returnKeyIfNotFound ? key : '';
  }

  // Traduire plusieurs clés en une seule fois (optimisé pour les performances)
  async translateBatch(
    language: string,
    keys: string[],
    options: TranslationOptions = {}
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    const { namespace = 'common' } = options;

    // Utiliser les traductions compilées si disponibles
    if (this.compiledTranslations[language]) {
      const compiled = this.compiledTranslations[language];

      keys.forEach(key => {
        const translation = compiled.flat.get(key);
        results[key] = translation || key;
      });

      return results;
    }

    // Charger les traductions compilées si nécessaire
    try {
      const compiled = await TranslationCache.getAll(language);
      this.compiledTranslations[language] = compiled;

      keys.forEach(key => {
        const translation = compiled.flat.get(key);
        results[key] = translation || key;
      });
    } catch (error) {
      console.error(`Erreur lors du chargement des traductions pour ${language}:`, error);

      // Fallback: retourner les clés comme valeurs
      keys.forEach(key => {
        results[key] = key;
      });
    }

    return results;
  }

  // Obtenir toutes les traductions d'un namespace (avec cache)
  async getNamespaceTranslations(
    language: string,
    namespace: string
  ): Promise<any> {
    try {
      const compiled = await TranslationCache.getAll(language);
      return compiled.hierarchical[namespace] || {};
    } catch (error) {
      console.error(`Erreur lors du chargement du namespace ${namespace} pour ${language}:`, error);
      return {};
    }
  }

  // Vérifier si une langue est supportée et chargée
  isLanguageLoaded(language: string): boolean {
    return this.preloadedLanguages.has(language) || TranslationCache.has(language, 'common');
  }

  // Précharger une langue spécifique
  async preloadLanguage(language: string): Promise<void> {
    if (this.preloadedLanguages.has(language)) {
      return;
    }

    try {
      await TranslationCache.preload([language]);
      this.preloadedLanguages.add(language);
      console.log(`✅ Langue ${language} préchargée`);
    } catch (error) {
      console.error(`Erreur lors du préchargement de ${language}:`, error);
    }
  }

  // Obtenir les statistiques de performance
  getPerformanceStats(): {
    preloadedLanguages: string[];
    cacheStats: any;
    compiledTranslations: string[];
  } {
    return {
      preloadedLanguages: Array.from(this.preloadedLanguages),
      cacheStats: TranslationCache.getStats(),
      compiledTranslations: Object.keys(this.compiledTranslations)
    };
  }

  // Invalider le cache d'une langue
  async invalidateLanguage(language: string): Promise<void> {
    try {
      TranslationCache.invalidate(language);
      delete this.compiledTranslations[language];
      this.preloadedLanguages.delete(language);
      console.log(`🗑️ Cache invalidé pour ${language}`);
    } catch (error) {
      console.error(`Erreur lors de l'invalidation de ${language}:`, error);
    }
  }

  // Nettoyer toutes les données en cache
  clearCache(): void {
    TranslationCache.clear();
    this.compiledTranslations = {};
    this.preloadedLanguages.clear();
    console.log('🧹 Cache complètement vidé');
  }
}

// Instance singleton du service de traduction optimisé
export const optimizedTranslationService = new OptimizedTranslationService();

// Fonctions d'export pour la compatibilité
export const translate = (
  language: string,
  key: string,
  options?: TranslationOptions
): Promise<string> => {
  return optimizedTranslationService.translate(language, key, options);
};

export const translateBatch = (
  language: string,
  keys: string[],
  options?: TranslationOptions
): Promise<Record<string, string>> => {
  return optimizedTranslationService.translateBatch(language, keys, options);
};

export const getNamespaceTranslations = (
  language: string,
  namespace: string
): Promise<any> => {
  return optimizedTranslationService.getNamespaceTranslations(language, namespace);
};

export default optimizedTranslationService;