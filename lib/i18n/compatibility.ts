/**
 * Translation Compatibility Layer
 * 
 * This module provides backward compatibility for components that haven't been
 * updated to use the new namespaced translation system yet.
 */

import { useTranslation } from 'react-i18next';

export function useCompatibleTranslation() {
  const { t: tCommon } = useTranslation('common');
  const { t: tNav } = useTranslation('navigation');
  const { t: tPages } = useTranslation('pages');
  const { t: tForms } = useTranslation('forms');
  const { t: tActions } = useTranslation('actions');
  const { t: tMisc } = useTranslation('misc');

  // Legacy translation function that maps old keys to new namespaced structure
  const t = (key, options = {}) => {
    // Try to determine namespace from key structure
    if (key.startsWith('nav.')) {
      return tNav(key, options);
    } else if (key.startsWith('common.')) {
      return tCommon(key, options);
    } else if (['home.', 'about.', 'contact.', 'donate.', 'projects.', 'blog.', 'information.'].some(prefix => key.startsWith(prefix))) {
      return tPages(key, options);
    } else if (key.startsWith('footer.')) {
      return tCommon(key, options);
    } else {
      // Try each namespace until we find the key
      for (const tFunc of [tPages, tCommon, tNav, tForms, tActions, tMisc]) {
        try {
          const result = tFunc(key, options);
          if (result !== key) return result;
        } catch (e) {
          // Continue to next namespace
        }
      }
      
      // Fallback to misc namespace
      return tMisc(key, options);
    }
  };

  return { t };
}