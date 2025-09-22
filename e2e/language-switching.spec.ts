import { test, expect, Page, BrowserContext } from '@playwright/test'

test.describe('Language Switching E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Language Detection', () => {
    test('should detect browser language preference', async ({ page, context }) => {
      // Set browser language to French
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'language', {
          get: () => 'fr-FR'
        })
        Object.defineProperty(navigator, 'languages', {
          get: () => ['fr-FR', 'fr', 'en-US']
        })
      })

      await page.reload()
      
      // Should redirect to French version or show French content
      await expect(page).toHaveURL(/\/fr/)
    })

    test('should fallback to English for unsupported languages', async ({ page, context }) => {
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'language', {
          get: () => 'xyz-XYZ'
        })
        Object.defineProperty(navigator, 'languages', {
          get: () => ['xyz-XYZ']
        })
      })

      await page.reload()
      
      // Should use English as fallback
      await expect(page).toHaveURL(/\/en/)
    })
  })

  test.describe('Language Selector', () => {
    test('should open language selector on click', async ({ page }) => {
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      
      await expect(page.getByRole('listbox')).toBeVisible()
      await expect(page.getByText('Français')).toBeVisible()
      await expect(page.getByText('Español')).toBeVisible()
    })

    test('should change language when option selected', async ({ page }) => {
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      
      await page.getByText('Français').click()
      
      // Should redirect to French version
      await expect(page).toHaveURL(/\/fr/)
      
      // Content should be in French
      await expect(page.getByText(/accueil/i)).toBeVisible()
    })

    test('should persist language selection across page navigation', async ({ page }) => {
      // Change to Spanish
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('Español').click()
      
      await expect(page).toHaveURL(/\/es/)
      
      // Navigate to another page
      await page.getByRole('link', { name: /about/i }).click()
      
      // Should maintain Spanish language
      await expect(page).toHaveURL(/\/es\/about/)
    })

    test('should work with keyboard navigation', async ({ page }) => {
      const languageSelector = page.getByRole('button', { name: /language/i })
      
      // Focus and open with keyboard
      await languageSelector.focus()
      await page.keyboard.press('Enter')
      
      await expect(page.getByRole('listbox')).toBeVisible()
      
      // Navigate with arrow keys
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      
      // Should change language
      await expect(page).toHaveURL(/\/fr/)
    })
  })

  test.describe('URL Routing', () => {
    test('should handle direct URL access with language code', async ({ page }) => {
      await page.goto('/fr/about')
      
      await expect(page).toHaveURL('/fr/about')
      await expect(page.getByText(/à propos/i)).toBeVisible()
    })

    test('should redirect invalid language codes', async ({ page }) => {
      await page.goto('/xyz/about')
      
      // Should redirect to English version
      await expect(page).toHaveURL('/en/about')
    })

    test('should preserve query parameters during language switching', async ({ page }) => {
      await page.goto('/search?q=test&category=news')
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('Français').click()
      
      await expect(page).toHaveURL('/fr/search?q=test&category=news')
    })
  })

  test.describe('Content Translation', () => {
    test('should display translated navigation menu', async ({ page }) => {
      // Switch to French
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('Français').click()
      
      // Check navigation items are translated
      await expect(page.getByRole('link', { name: /accueil/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /à propos/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
    })

    test('should translate form labels and placeholders', async ({ page }) => {
      await page.goto('/contact')
      
      // Switch to Spanish
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('Español').click()
      
      // Check form elements are translated
      await expect(page.getByLabel(/nombre/i)).toBeVisible()
      await expect(page.getByLabel(/correo/i)).toBeVisible()
      await expect(page.getByPlaceholder(/tu mensaje/i)).toBeVisible()
    })

    test('should handle missing translations gracefully', async ({ page }) => {
      // Go to a page that might have missing translations
      await page.goto('/fr/some-new-page')
      
      // Should still render the page without errors
      await expect(page.locator('body')).toBeVisible()
      
      // Missing translations should fallback to English or show key
      const content = await page.textContent('body')
      expect(content).toBeTruthy()
    })
  })

  test.describe('RTL Language Support', () => {
    test('should apply RTL layout for Arabic', async ({ page }) => {
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('العربية').click()
      
      // Check RTL direction is applied
      const htmlElement = page.locator('html')
      await expect(htmlElement).toHaveAttribute('dir', 'rtl')
      
      // Check text alignment
      const mainContent = page.locator('main')
      const textAlign = await mainContent.evaluate(el => 
        getComputedStyle(el).textAlign
      )
      expect(textAlign).toBe('right')
    })

    test('should handle RTL navigation correctly', async ({ page }) => {
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('العربية').click()
      
      // Navigation should be right-aligned
      const nav = page.locator('nav')
      const flexDirection = await nav.evaluate(el => 
        getComputedStyle(el).flexDirection
      )
      expect(['row-reverse', 'row']).toContain(flexDirection)
    })
  })

  test.describe('Performance', () => {
    test('should load translations quickly', async ({ page }) => {
      const startTime = Date.now()
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('Français').click()
      
      // Wait for content to be translated
      await expect(page.getByText(/accueil/i)).toBeVisible()
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(2000) // Should load within 2 seconds
    })

    test('should cache translations for faster subsequent loads', async ({ page }) => {
      // First load
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('Français').click()
      await expect(page.getByText(/accueil/i)).toBeVisible()
      
      // Switch back to English
      const languageSelector2 = page.getByRole('button', { name: /langue/i })
      await languageSelector2.click()
      await page.getByText('English').click()
      
      // Switch to French again (should be faster due to caching)
      const startTime = Date.now()
      const languageSelector3 = page.getByRole('button', { name: /language/i })
      await languageSelector3.click()
      await page.getByText('Français').click()
      await expect(page.getByText(/accueil/i)).toBeVisible()
      
      const cachedLoadTime = Date.now() - startTime
      expect(cachedLoadTime).toBeLessThan(1000) // Cached load should be faster
    })
  })

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/locales/**', route => route.abort())
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('Français').click()
      
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible()
      
      // Should show fallback content
      const content = await page.textContent('body')
      expect(content).toBeTruthy()
    })

    test('should recover from translation loading failures', async ({ page }) => {
      // First, cause a failure
      await page.route('**/locales/fr/**', route => route.abort())
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('Français').click()
      
      // Then allow requests to succeed
      await page.unroute('**/locales/fr/**')
      
      // Try switching languages again
      const languageSelector2 = page.getByRole('button', { name: /language/i })
      await languageSelector2.click()
      await page.getByText('Español').click()
      
      // Should work normally
      await expect(page).toHaveURL(/\/es/)
    })
  })
})