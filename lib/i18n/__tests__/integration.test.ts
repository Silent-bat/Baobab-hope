import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LanguageProvider } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { createUrlWithLanguage, getLanguageFromUrl, redirectToLanguage } from '../url-utils'

// Mock Next.js router
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    pathname: '/test',
    query: {},
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock middleware functions
vi.mock('../middleware', () => ({
  createLanguageMiddleware: vi.fn(),
}))

describe('Language Switching Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Language Provider Integration', () => {
    it('should provide language context to children', async () => {
      const TestComponent = () => {
        return (
          <LanguageProvider>
            <div data-testid="test-content">Test Content</div>
          </LanguageProvider>
        )
      }

      render(<TestComponent />)
      
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
    })

    it('should handle language changes', async () => {
      const TestComponent = () => {
        return (
          <LanguageProvider>
            <LanguageSelector />
          </LanguageProvider>
        )
      }

      render(<TestComponent />)
      
      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      // Click language selector
      const selector = screen.getByRole('button')
      fireEvent.click(selector)

      // Should show language options
      await waitFor(() => {
        expect(screen.getByText(/français/i)).toBeInTheDocument()
      })
    })
  })

  describe('URL Routing Integration', () => {
    it('should create URLs with language codes', () => {
      const url = createUrlWithLanguage('/about', 'fr')
      expect(url).toBe('/fr/about')
    })

    it('should handle root path', () => {
      const url = createUrlWithLanguage('/', 'es')
      expect(url).toBe('/es')
    })

    it('should preserve query parameters', () => {
      const url = createUrlWithLanguage('/search?q=test', 'de')
      expect(url).toBe('/de/search?q=test')
    })

    it('should extract language from URL', () => {
      expect(getLanguageFromUrl('/fr/about')).toBe('fr')
      expect(getLanguageFromUrl('/es/contact')).toBe('es')
      expect(getLanguageFromUrl('/about')).toBe('en') // default
    })

    it('should handle invalid language codes in URL', () => {
      expect(getLanguageFromUrl('/xyz/about')).toBe('en')
    })
  })

  describe('Language Persistence', () => {
    it('should persist language selection across page loads', async () => {
      // Simulate language selection
      localStorage.setItem('preferred-language', 'fr')

      const TestComponent = () => {
        return (
          <LanguageProvider>
            <div data-testid="language-indicator">
              Current Language: French
            </div>
          </LanguageProvider>
        )
      }

      render(<TestComponent />)
      
      await waitFor(() => {
        expect(localStorage.getItem).toHaveBeenCalledWith('preferred-language')
      })
    })

    it('should update URL when language changes', async () => {
      const TestComponent = () => {
        return (
          <LanguageProvider>
            <button 
              onClick={() => redirectToLanguage('es', '/current-path')}
              data-testid="change-language"
            >
              Change to Spanish
            </button>
          </LanguageProvider>
        )
      }

      render(<TestComponent />)
      
      const button = screen.getByTestId('change-language')
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith('/es/current-path')
    })
  })

  describe('Fallback Behavior', () => {
    it('should fallback to English for unsupported languages', async () => {
      // Mock URL with unsupported language
      Object.defineProperty(window, 'location', {
        value: { pathname: '/xyz/about' },
        configurable: true
      })

      const TestComponent = () => {
        return (
          <LanguageProvider>
            <div data-testid="content">Content</div>
          </LanguageProvider>
        )
      }

      render(<TestComponent />)
      
      // Should redirect to English version
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/en/about')
      })
    })
  })

  describe('SEO Integration', () => {
    it('should generate proper hreflang tags', () => {
      // This would typically be tested in a Next.js environment
      // For now, we'll test the utility functions
      
      const languages = ['en', 'fr', 'es', 'de']
      const currentPath = '/about'
      
      const hreflangs = languages.map(lang => ({
        hreflang: lang,
        href: createUrlWithLanguage(currentPath, lang)
      }))

      expect(hreflangs).toEqual([
        { hreflang: 'en', href: '/en/about' },
        { hreflang: 'fr', href: '/fr/about' },
        { hreflang: 'es', href: '/es/about' },
        { hreflang: 'de', href: '/de/about' }
      ])
    })
  })

  describe('Error Handling', () => {
    it('should handle translation loading errors gracefully', async () => {
      // Mock fetch to fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const TestComponent = () => {
        return (
          <LanguageProvider>
            <div data-testid="content">Content should still render</div>
          </LanguageProvider>
        )
      }

      render(<TestComponent />)
      
      // Component should still render despite translation loading failure
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('should handle localStorage errors', async () => {
      // Mock localStorage to throw
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const TestComponent = () => {
        return (
          <LanguageProvider>
            <LanguageSelector />
          </LanguageProvider>
        )
      }

      render(<TestComponent />)
      
      // Should not crash the application
      expect(screen.getByRole('button')).toBeInTheDocument()
      
      // Restore original function
      localStorage.setItem = originalSetItem
    })
  })
})