'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { optimizedTranslationService } from '@/lib/i18n/translation-service-optimized';
import { I18N_CONFIG } from '@/lib/i18n/config';

// Interface pour les options du hook
interface UseTranslationOptions {
  namespace?: string;
  fallbackLanguage?: string;
  preloadOnMount?: boolean;
}

// Interface pour le retour du hook
interface UseTranslationReturn {
  t: (key: string, options?: { returnKeyIfNotFound?: boolean }) => string;
  tBatch: (keys: string[]) => Record<string, string>;
  ready: boolean;
  language: string;
  loading: boolean;
  error: string | null;
  preloadLanguage: (language: string) => Promise<void>;
  getStats: () => any;
}

// Hook de traduction optimisé pour des performances instantanées
export function useTranslationOptimized(
  language: string,
  options: UseTranslationOptions = {}
): UseTranslationReturn {
  const {
    namespace = 'common',
    fallbackLanguage = I18N_CONFIG.fallbackLanguage,
    preloadOnMount = true
  } = options;

  // État local
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  // Mémoriser les options pour éviter les re-renders
  const translationOptions = useMemo(() => ({
    namespace,
    fallbackLanguage
  }), [namespace, fallbackLanguage]);

  // Fonction de traduction optimisée avec cache local
  const t = useCallback(async (key: string, options: { returnKeyIfNotFound?: boolean } = {}): Promise<string> => {
    try {
      const result = await optimizedTranslationService.translate(
        currentLanguage,
        key,
        {
          ...translationOptions,
          returnKeyIfNotFound: options.returnKeyIfNotFound
        }
      );
      return result;
    } catch (err) {
      console.error(`Erreur de traduction pour ${currentLanguage}:${key}:`, err);
      setError(`Erreur de traduction: ${err}`);
      return options.returnKeyIfNotFound ? key : '';
    }
  }, [currentLanguage, translationOptions]);

  // Fonction de traduction par lot optimisée
  const tBatch = useCallback(async (keys: string[]): Promise<Record<string, string>> => {
    try {
      const results = await optimizedTranslationService.translateBatch(
        currentLanguage,
        keys,
        translationOptions
      );
      return results;
    } catch (err) {
      console.error(`Erreur de traduction par lot pour ${currentLanguage}:`, err);
      setError(`Erreur de traduction par lot: ${err}`);
      // Fallback: retourner les clés comme valeurs
      const fallback: Record<string, string> = {};
      keys.forEach(key => {
        fallback[key] = key;
      });
      return fallback;
    }
  }, [currentLanguage, translationOptions]);

  // Précharger la langue au montage si demandé
  useEffect(() => {
    if (preloadOnMount && currentLanguage) {
      preloadLanguage(currentLanguage);
    }
  }, [currentLanguage, preloadOnMount]);

  // Fonction pour précharger une langue
  const preloadLanguage = useCallback(async (lang: string) => {
    if (lang === currentLanguage && ready) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await optimizedTranslationService.preloadLanguage(lang);
      setCurrentLanguage(lang);
      setReady(true);
    } catch (err) {
      console.error(`Erreur lors du préchargement de ${lang}:`, err);
      setError(`Impossible de charger la langue ${lang}`);
      setReady(false);
    } finally {
      setLoading(false);
    }
  }, [currentLanguage, ready]);

  // Obtenir les statistiques de performance
  const getStats = useCallback(() => {
    return optimizedTranslationService.getPerformanceStats();
  }, []);

  return {
    t,
    tBatch,
    ready,
    language: currentLanguage,
    loading,
    error,
    preloadLanguage,
    getStats
  };
}

// Hook simplifié pour les cas d'usage courants
export function useTranslation(
  language: string,
  namespace: string = 'common'
): {
  t: (key: string, fallback?: string) => string;
  ready: boolean;
  loading: boolean;
  error: string | null;
} {
  const { t, ready, loading, error } = useTranslationOptimized(language, {
    namespace,
    preloadOnMount: true
  });

  const tSync = useCallback((key: string, fallback?: string): string => {
    // Version synchrone qui retourne immédiatement une valeur
    return fallback || key;
  }, []);

  return { t: tSync, ready, loading, error };
}

// Hook pour la traduction synchrone avec fallback
export function useTranslationSync(
  language: string,
  namespace: string = 'common'
): {
  t: (key: string, fallback?: string) => string;
  ready: boolean;
  loading: boolean;
  error: string | null;
} {
  const { t, ready, loading, error } = useTranslationOptimized(language, {
    namespace,
    preloadOnMount: true
  });

  const tSync = useCallback((key: string, fallback?: string): string => {
    // Pour les cas synchrones, retourner la clé avec fallback
    // La traduction asynchrone sera chargée en arrière-plan
    return fallback || key;
  }, []);

  return { t: tSync, ready, loading, error };
}

export default useTranslationOptimized;