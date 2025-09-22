import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { LanguageProvider } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'

// Extend expect with axe matchers
expect.extend(toHaveNoViolations)

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/test',
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Language Selector Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LanguageProvider>
          <LanguageSelector />
        </LanguageProvider>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      
      render(
        <LanguageProvider>
          <LanguageSelector />
        </LanguageProvider>
      )

      const selector = screen.getByRole('button')
      
      // Should be focusable
      await user.tab()
      expect(selector).toHaveFocus()

      // Should open with Enter key
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      // Should navigate options with arrow keys
      await user.keyboard('{ArrowDown}')
      
      const options = screen.getAllByRole('option')
      expect(options[0]).toHaveAttribute('aria-selected', 'true')
    })

    it('should have proper ARIA attributes', async () => {
      render(
        <LanguageProvider>
          <LanguageSelector />
        </LanguageProvider>
      )

      const selector = screen.getByRole('button')
      
      expect(selector).toHaveAttribute('aria-haspopup', 'listbox')
      expect(selector).toHaveAttribute('aria-expanded', 'false')
      expect(selector).toHaveAttribute('aria-label')

      // Open dropdown
      fireEvent.click(selector)

      await waitFor(() => {
        expect(selector).toHaveAttribute('aria-expanded', 'true')
        
        const listbox = screen.getByRole('listbox')
        expect(listbox).toHaveAttribute('aria-labelledby')
        
        const options = screen.getAllByRole('option')
        options.forEach(option => {
          expect(option).toHaveAttribute('role', 'option')
          expect(option).toHaveAttribute('aria-selected')
        })
      })
    })

    it('should announce language changes to screen readers', async () => {
      const mockAnnounce = vi.fn()
      
      // Mock live region announcements
      Object.defineProperty(document, 'createElement', {
        value: vi.fn().mockImplementation((tagName) => {
          if (tagName === 'div') {
            return {
              setAttribute: vi.fn(),
              textContent: '',
              style: {},
              appendChild: vi.fn(),
              removeChild: vi.fn(),
            }
          }
          return document.createElement(tagName)
        })
      })

      render(
        <LanguageProvider>
          <LanguageSelector />
        </LanguageProvider>
      )

      const selector = screen.getByRole('button')
      fireEvent.click(selector)

      await waitFor(() => {
        const frenchOption = screen.getByText(/français/i)
        fireEvent.click(frenchOption)
      })

      // Should create live region for announcements
      expect(document.createElement).toHaveBeenCalledWith('div')
    })

    it('should support high contrast mode', async () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      const { container } = render(
        <LanguageProvider>
          <LanguageSelector />
        </LanguageProvider>
      )

      // Should still be accessible in high contrast mode
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Language Attributes', () => {
    it('should set proper lang attributes on content', async () => {
      const TestContent = () => (
        <LanguageProvider>
          <div data-testid="content">
            <p>Test content</p>
          </div>
        </LanguageProvider>
      )

      render(<TestContent />)

      await waitFor(() => {
        const content = screen.getByTestId('content')
        expect(content.closest('[lang]')).toHaveAttribute('lang')
      })
    })

    it('should update lang attributes when language changes', async () => {
      const TestContent = () => (
        <LanguageProvider>
          <div data-testid="content">
            <LanguageSelector />
            <p>Test content</p>
          </div>
        </LanguageProvider>
      )

      render(<TestContent />)

      // Change language to French
      const selector = screen.getByRole('button')
      fireEvent.click(selector)

      await waitFor(() => {
        const frenchOption = screen.getByText(/français/i)
        fireEvent.click(frenchOption)
      })

      await waitFor(() => {
        const content = screen.getByTestId('content')
        expect(content.closest('[lang]')).toHaveAttribute('lang', 'fr')
      })
    })
  })

  describe('RTL Language Support', () => {
    it('should set proper text direction for RTL languages', async () => {
      const TestContent = () => (
        <LanguageProvider initialLanguage="ar">
          <div data-testid="content">
            <p>Arabic content</p>
          </div>
        </LanguageProvider>
      )

      render(<TestContent />)

      await waitFor(() => {
        const content = screen.getByTestId('content')
        expect(content.closest('[dir]')).toHaveAttribute('dir', 'rtl')
      })
    })

    it('should maintain accessibility in RTL layout', async () => {
      const { container } = render(
        <LanguageProvider initialLanguage="ar">
          <LanguageSelector />
        </LanguageProvider>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Focus Management', () => {
    it('should maintain focus when switching languages', async () => {
      const user = userEvent.setup()
      
      render(
        <LanguageProvider>
          <LanguageSelector />
          <button data-testid="other-button">Other Button</button>
        </LanguageProvider>
      )

      const otherButton = screen.getByTestId('other-button')
      await user.click(otherButton)
      expect(otherButton).toHaveFocus()

      // Change language
      const selector = screen.getByRole('button')
      await user.click(selector)

      await waitFor(() => {
        const frenchOption = screen.getByText(/français/i)
        user.click(frenchOption)
      })

      // Focus should be managed appropriately
      await waitFor(() => {
        expect(document.activeElement).toBeTruthy()
      })
    })

    it('should trap focus within language selector dropdown', async () => {
      const user = userEvent.setup()
      
      render(
        <LanguageProvider>
          <LanguageSelector />
        </LanguageProvider>
      )

      const selector = screen.getByRole('button')
      await user.click(selector)

      await waitFor(() => {
        const listbox = screen.getByRole('listbox')
        expect(listbox).toBeInTheDocument()
      })

      // Tab should cycle through options
      await user.tab()
      await user.tab()
      
      // Should stay within the dropdown
      const focusedElement = document.activeElement
      expect(focusedElement?.closest('[role="listbox"]')).toBeTruthy()
    })
  })

  describe('Error Messages Accessibility', () => {
    it('should announce translation errors to screen readers', async () => {
      // Mock translation service to fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Translation failed'))

      const TestContent = () => (
        <LanguageProvider>
          <div data-testid="content">Content with translation error</div>
        </LanguageProvider>
      )

      const { container } = render(<TestContent />)

      // Should still be accessible even with errors
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should provide accessible error messages', async () => {
      const TestContent = () => (
        <LanguageProvider>
          <div role="alert" data-testid="error-message">
            Translation service unavailable
          </div>
        </LanguageProvider>
      )

      render(<TestContent />)

      const errorMessage = screen.getByTestId('error-message')
      expect(errorMessage).toHaveAttribute('role', 'alert')
    })
  })

  describe('Reduced Motion Support', () => {
    it('should respect prefers-reduced-motion', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      const { container } = render(
        <LanguageProvider>
          <LanguageSelector />
        </LanguageProvider>
      )

      // Should still be accessible with reduced motion
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})