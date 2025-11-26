'use client';

import { useState, useEffect, useCallback } from 'react';
import { translationService } from '@/lib/i18n/translation-service';
import { I18N_CONFIG } from '@/lib/i18n/config';

// Simplified hook interface
interface UseTranslationOptions {
  fallbackLanguage?: string;
  preloadOnMount?: boolean;
}

// Hook return interface
interface UseTranslationReturn {
  t: (key: string, options?: { returnKeyIfNotFound?: boolean }) => string;
  ready: boolean;
  language: string;
  loading: boolean;
  error: string | null;
  preloadLanguage: (language: string) => Promise<void>;
}

// Simplified translation hook for single-file system
export function useTranslationOptimized(
  language: string,
  options: UseTranslationOptions = {}
): UseTranslationReturn {
  const {
    fallbackLanguage = I18N_CONFIG.fallbackLanguage,
    preloadOnMount = true
  } = options;

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  // Synchronous translation function  
  const t = useCallback((key: string, options: { returnKeyIfNotFound?: boolean } = {}): string => {
    try {
      return translationService.getTranslation(key, currentLanguage, {
        returnKeyIfNotFound: options.returnKeyIfNotFound
      });
    } catch (err) {
      console.error(`Translation error for ${currentLanguage}:${key}:`, err);
      setError(`Translation error: ${err}`);
      return options.returnKeyIfNotFound !== false ? key : '';
    }
  }, [currentLanguage]);

  // Preload language on mount
  useEffect(() => {
    if (preloadOnMount && currentLanguage) {
      preloadLanguage(currentLanguage);
    }
  }, [currentLanguage, preloadOnMount]);

  // Preload function
  const preloadLanguage = useCallback(async (lang: string) => {
    if (lang === currentLanguage && ready) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await translationService.loadTranslations(lang);
      setCurrentLanguage(lang);
      setReady(true);
    } catch (err) {
      console.error(`Error preloading ${lang}:`, err);
      setError(`Unable to load language ${lang}`);
      setReady(false);
    } finally {
      setLoading(false);
    }
  }, [currentLanguage, ready]);

  return {
    t,
    ready,
    language: currentLanguage,
    loading,
    error,
    preloadLanguage
  };
}

// Simplified hook for common use cases
export function useTranslation(
  language: string
): {
  t: (key: string, fallback?: string) => string;
  ready: boolean;
  loading: boolean;
  error: string | null;
} {
  const { t, ready, loading, error } = useTranslationOptimized(language, {
    preloadOnMount: true
  });

  const tSync = useCallback((key: string, fallback?: string): string => {
    const result = t(key);
    return result || fallback || key;
  }, [t]);

  return { t: tSync, ready, loading, error };
}

// Synchronous translation hook with fallback
export function useTranslationSync(
  language: string
): {
  t: (key: string, fallback?: string) => string;
  ready: boolean;
  loading: boolean;
  error: string | null;
} {
  const { t, ready, loading, error } = useTranslationOptimized(language, {
    preloadOnMount: true
  });

  const tSync = useCallback((key: string, fallback?: string): string => {
    const result = t(key);
    return result || fallback || key;
  }, [t]);

  return { t: tSync, ready, loading, error };
}

export default useTranslationOptimized;