"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useLanguage } from "./language-provider"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { ChevronDown, Globe, Search, X } from "lucide-react"
import { useRTLStyles } from "@/lib/rtl-utils"
import { useAccessibility } from "@/hooks/use-accessibility"

export function LanguageSelector() {
  const { language, availableLanguages, setLanguage, isLoading, direction, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const rtlStyles = useRTLStyles(language)
  const { announceToScreenReader } = useAccessibility()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([])

  const currentLanguage = availableLanguages.find(lang => lang.code === language)
  
  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    // Show all languages if searching; otherwise show all available languages
    const languagesToFilter = searchQuery.trim() ? availableLanguages : availableLanguages
    
    if (!searchQuery.trim()) return languagesToFilter
    
    const query = searchQuery.toLowerCase()
    return languagesToFilter.filter(lang => 
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query)
    )
  }, [availableLanguages, searchQuery])

  const handleLanguageChange = async (newLanguage: string) => {
    const newLang = availableLanguages.find(lang => lang.code === newLanguage)
    
    setIsOpen(false)
    setSearchQuery("")
    setFocusedIndex(-1)
    
    await setLanguage(newLanguage)
    
    // Announce the change to screen readers
    announceToScreenReader(
      t('accessibility.languageChanged', { interpolation: { language: newLang?.name || newLanguage } })
    )
    
    // Return focus to trigger button after language change
    setTimeout(() => {
      triggerRef.current?.focus()
    }, 100)
  }

  // Handle keyboard navigation in the dropdown
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setSearchQuery("")
        setFocusedIndex(-1)
        triggerRef.current?.focus()
        break
        
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => {
          const nextIndex = prev < filteredLanguages.length - 1 ? prev + 1 : 0
          menuItemsRef.current[nextIndex]?.focus()
          return nextIndex
        })
        break
        
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => {
          const nextIndex = prev > 0 ? prev - 1 : filteredLanguages.length - 1
          menuItemsRef.current[nextIndex]?.focus()
          return nextIndex
        })
        break
        
      case 'Enter':
        event.preventDefault()
        if (focusedIndex >= 0 && filteredLanguages[focusedIndex]) {
          handleLanguageChange(filteredLanguages[focusedIndex].code)
        }
        break
        
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        menuItemsRef.current[0]?.focus()
        break
        
      case 'End':
        event.preventDefault()
        const lastIndex = filteredLanguages.length - 1
        setFocusedIndex(lastIndex)
        menuItemsRef.current[lastIndex]?.focus()
        break
    }
  }

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Reset search and focus when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setFocusedIndex(-1)
    }
  }, [isOpen])

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    searchInputRef.current?.focus()
  }

  return (
    <div data-language-selector onKeyDown={handleKeyDown}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            size="sm"
            className={`${rtlStyles.isRTL ? 'gap-x-reverse gap-2' : 'gap-2'} 
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
              high-contrast:border-2 high-contrast:border-black
              transition-all duration-200 max-w-[10rem] md:max-w-[12rem] overflow-hidden`}
            disabled={isLoading}
            dir={direction}
            aria-label={t('accessibility.currentLanguage', { interpolation: { language: currentLanguage?.name || language } })}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-describedby="language-selector-description"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline font-medium truncate">
              {currentLanguage?.nativeName || currentLanguage?.name || language.toUpperCase()}
            </span>
            <span className="sm:hidden text-lg" role="img" aria-label={currentLanguage?.name || language}>
              {currentLanguage?.flag || '🌐'}
            </span>
            <ChevronDown 
              className={`h-3 w-3 ${rtlStyles.isRTL ? 'rtl-flip' : ''} transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={rtlStyles.isRTL ? "start" : "end"} 
          className="w-80 bg-white border border-gray-200 shadow-lg rounded-lg" 
        >
          {/* Search Section */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search 
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${rtlStyles.isRTL ? 'right-3' : 'left-3'}`}
                aria-hidden="true"
              />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 bg-gray-50 border border-gray-200 rounded-md text-sm 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                  ${rtlStyles.isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'}`}
                dir={direction}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className={`absolute top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 
                    hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 rounded
                    ${rtlStyles.isRTL ? 'left-2' : 'right-2'}`}
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Languages List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              <>
                {/* Current Language */}
                {currentLanguage && filteredLanguages.find(lang => lang.code === language) && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                      Current Language
                    </div>
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange(language)}
                      className="flex items-center px-3 py-3 gap-3 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                    >
                      <span className="text-lg">{currentLanguage.flag}</span>
                      <div className="flex flex-col flex-1">
                        <span className="font-medium text-gray-900">{currentLanguage.nativeName}</span>
                        <span className="text-xs text-gray-500">{currentLanguage.name}</span>
                      </div>
                      <span className="text-xs text-blue-600 font-bold">✓</span>
                    </DropdownMenuItem>
                    
                    {filteredLanguages.length > 1 && (
                      <DropdownMenuSeparator className="my-1" />
                    )}
                  </>
                )}

                {/* Other Languages */}
                {filteredLanguages.length > 1 && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                      Available Languages
                    </div>
                    {filteredLanguages
                      .filter(lang => lang.code !== language)
                      .map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className="flex items-center px-3 py-3 gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <div className="flex flex-col flex-1">
                            <span className="font-medium text-gray-900">{lang.nativeName}</span>
                            <span className="text-xs text-gray-500">{lang.name}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                  </>
                )}
              </>
            ) : (
              <div className="px-3 py-6 text-center text-sm text-gray-500">
                <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No languages found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100 bg-gray-50">
            {searchQuery ? `${filteredLanguages.length} results` : `${availableLanguages.length} languages available`}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Hidden description for screen readers */}
      <div id="language-selector-description" className="sr-only">
        {t('accessibility.languageSelector')}. {t('accessibility.languageOptions')}
      </div>
    </div>
  )
}