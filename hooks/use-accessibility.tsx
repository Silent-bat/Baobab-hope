"use client"

import { useEffect, useRef } from "react"
import { useLanguage } from "@/components/language-provider"

interface UseAccessibilityOptions {
  announceChanges?: boolean
  manageFocus?: boolean
  addLangAttributes?: boolean
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const { language, direction, t } = useLanguage()
  const { announceChanges = true, manageFocus = true, addLangAttributes = true } = options
  const previousLanguage = useRef<string>(language)

  // Add lang attributes to content sections
  useEffect(() => {
    if (!addLangAttributes) return

    // Update document language attributes
    document.documentElement.lang = language
    document.documentElement.dir = direction

    // Update any content sections with lang attributes
    const contentSections = document.querySelectorAll('[data-content-section]')
    contentSections.forEach((section) => {
      section.setAttribute('lang', language)
      section.setAttribute('dir', direction)
    })
  }, [language, direction, addLangAttributes])

  // Announce language changes to screen readers
  useEffect(() => {
    if (!announceChanges || previousLanguage.current === language) return

    const announcement = t('accessibility.languageChanged', { language })
    announceToScreenReader(announcement)
    
    previousLanguage.current = language
  }, [language, announceChanges, t])

  // Utility function to announce messages to screen readers
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.setAttribute('class', 'sr-only absolute -left-10000 w-1 h-1 overflow-hidden')
    liveRegion.textContent = message
    
    document.body.appendChild(liveRegion)
    
    // Remove after screen readers have processed it
    setTimeout(() => {
      if (document.body.contains(liveRegion)) {
        document.body.removeChild(liveRegion)
      }
    }, 1000)
  }

  // Focus management utilities
  const manageFocusForLanguageChange = () => {
    if (!manageFocus) return

    // Find the currently focused element
    const activeElement = document.activeElement as HTMLElement
    
    // If it's a language selector, maintain focus
    if (activeElement?.closest('[data-language-selector]')) {
      // Small delay to ensure DOM updates are complete
      setTimeout(() => {
        const newSelector = document.querySelector('[data-language-selector] button') as HTMLElement
        newSelector?.focus()
      }, 100)
    }
  }

  // Create skip links for better navigation
  const createSkipLinks = () => {
    const skipLinks = document.getElementById('skip-links')
    if (skipLinks) return // Already exists

    const skipLinksContainer = document.createElement('div')
    skipLinksContainer.id = 'skip-links'
    skipLinksContainer.className = 'sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-0 focus-within:left-0 focus-within:z-50 focus-within:bg-white focus-within:p-4 focus-within:shadow-lg'
    
    const skipToContent = document.createElement('a')
    skipToContent.href = '#main-content'
    skipToContent.textContent = t('accessibility.skipToContent')
    skipToContent.className = 'block text-blue-600 hover:text-blue-800 underline mb-2'
    
    const skipToNav = document.createElement('a')
    skipToNav.href = '#main-navigation'
    skipToNav.textContent = t('accessibility.skipToNavigation')
    skipToNav.className = 'block text-blue-600 hover:text-blue-800 underline'
    
    skipLinksContainer.appendChild(skipToContent)
    skipLinksContainer.appendChild(skipToNav)
    
    document.body.insertBefore(skipLinksContainer, document.body.firstChild)
  }

  // Initialize skip links on mount
  useEffect(() => {
    createSkipLinks()
  }, [t])

  return {
    announceToScreenReader,
    manageFocusForLanguageChange,
    language,
    direction
  }
}

// Higher-order component to add accessibility features to any component
export function withAccessibility<T extends object>(
  Component: React.ComponentType<T>,
  options?: UseAccessibilityOptions
) {
  return function AccessibleComponent(props: T) {
    useAccessibility(options)
    return <Component {...props} />
  }
}