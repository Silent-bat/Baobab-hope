// RTL utility functions and CSS-in-JS helpers

import { getLanguageDirection } from './i18n'

/**
 * Get CSS properties for RTL-aware styling
 */
export function getRTLStyles(language: string) {
  const direction = getLanguageDirection(language)
  const isRTL = direction === 'rtl'
  
  return {
    direction,
    textAlign: isRTL ? 'right' as const : 'left' as const,
    marginLeft: isRTL ? 'auto' : undefined,
    marginRight: isRTL ? undefined : 'auto',
  }
}

/**
 * Get directional CSS class names
 */
export function getRTLClasses(language: string): string {
  const direction = getLanguageDirection(language)
  return `dir-${direction} ${direction}`
}

/**
 * Get logical CSS properties for RTL support
 */
export function getLogicalStyles(props: {
  marginStart?: string | number
  marginEnd?: string | number
  paddingStart?: string | number
  paddingEnd?: string | number
  borderStartWidth?: string | number
  borderEndWidth?: string | number
  borderStartColor?: string
  borderEndColor?: string
  left?: string | number
  right?: string | number
}) {
  const styles: Record<string, any> = {}
  
  // Convert logical properties to physical properties
  if (props.marginStart !== undefined) {
    styles.marginInlineStart = props.marginStart
  }
  if (props.marginEnd !== undefined) {
    styles.marginInlineEnd = props.marginEnd
  }
  if (props.paddingStart !== undefined) {
    styles.paddingInlineStart = props.paddingStart
  }
  if (props.paddingEnd !== undefined) {
    styles.paddingInlineEnd = props.paddingEnd
  }
  if (props.borderStartWidth !== undefined) {
    styles.borderInlineStartWidth = props.borderStartWidth
  }
  if (props.borderEndWidth !== undefined) {
    styles.borderInlineEndWidth = props.borderEndWidth
  }
  if (props.borderStartColor !== undefined) {
    styles.borderInlineStartColor = props.borderStartColor
  }
  if (props.borderEndColor !== undefined) {
    styles.borderInlineEndColor = props.borderEndColor
  }
  if (props.left !== undefined) {
    styles.insetInlineStart = props.left
  }
  if (props.right !== undefined) {
    styles.insetInlineEnd = props.right
  }
  
  return styles
}

/**
 * Transform Tailwind classes for RTL support
 */
export function transformTailwindRTL(classes: string, language: string): string {
  const direction = getLanguageDirection(language)
  if (direction === 'ltr') return classes
  
  // RTL transformations for common Tailwind classes
  const rtlTransforms: Record<string, string> = {
    // Margins
    'ml-': 'mr-',
    'mr-': 'ml-',
    'pl-': 'pr-',
    'pr-': 'pl-',
    // Borders
    'border-l': 'border-r',
    'border-r': 'border-l',
    'rounded-l': 'rounded-r',
    'rounded-r': 'rounded-l',
    'rounded-tl': 'rounded-tr',
    'rounded-tr': 'rounded-tl',
    'rounded-bl': 'rounded-br',
    'rounded-br': 'rounded-bl',
    // Text alignment
    'text-left': 'text-right',
    'text-right': 'text-left',
    // Positioning
    'left-': 'right-',
    'right-': 'left-',
    // Transforms
    'translate-x-': 'rtl:-translate-x-',
    // Flex
    'justify-start': 'justify-end',
    'justify-end': 'justify-start',
    'items-start': 'items-end',
    'items-end': 'items-start',
  }
  
  let transformedClasses = classes
  
  Object.entries(rtlTransforms).forEach(([ltr, rtl]) => {
    const regex = new RegExp(`\\b${ltr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\w-]*)`, 'g')
    transformedClasses = transformedClasses.replace(regex, (match, suffix) => {
      return rtl.replace('-', `-${suffix || ''}`)
    })
  })
  
  return transformedClasses
}

/**
 * Create RTL-aware CSS custom properties
 */
export function createRTLCustomProperties(language: string): Record<string, string> {
  const direction = getLanguageDirection(language)
  const isRTL = direction === 'rtl'
  
  return {
    '--direction': direction,
    '--start': isRTL ? 'right' : 'left',
    '--end': isRTL ? 'left' : 'right',
    '--rotate-start': isRTL ? '180deg' : '0deg',
    '--rotate-end': isRTL ? '0deg' : '180deg',
    '--translate-x-start': isRTL ? '100%' : '-100%',
    '--translate-x-end': isRTL ? '-100%' : '100%',
  }
}

/**
 * Hook for RTL-aware component styling
 */
export function useRTLStyles(language: string) {
  const direction = getLanguageDirection(language)
  const isRTL = direction === 'rtl'
  
  return {
    direction,
    isRTL,
    isLTR: !isRTL,
    getRTLClasses: () => getRTLClasses(language),
    getRTLStyles: () => getRTLStyles(language),
    getLogicalStyles,
    transformClasses: (classes: string) => transformTailwindRTL(classes, language),
    customProperties: createRTLCustomProperties(language),
  }
}