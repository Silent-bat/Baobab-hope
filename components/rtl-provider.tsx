"use client"

import { useEffect } from "react"
import { useLanguage } from "./language-provider"

interface RTLProviderProps {
  children: React.ReactNode
}

export function RTLProvider({ children }: RTLProviderProps) {
  const { direction } = useLanguage()

  useEffect(() => {
    // Update document direction
    document.documentElement.dir = direction
    document.documentElement.setAttribute('data-direction', direction)
    
    // Update body class for CSS targeting
    document.body.classList.remove('ltr', 'rtl')
    document.body.classList.add(direction)
    
    // Update CSS custom property for dynamic styling
    document.documentElement.style.setProperty('--text-direction', direction)
    document.documentElement.style.setProperty('--start', direction === 'rtl' ? 'right' : 'left')
    document.documentElement.style.setProperty('--end', direction === 'rtl' ? 'left' : 'right')
  }, [direction])

  return <>{children}</>
}