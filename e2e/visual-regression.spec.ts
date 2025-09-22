import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  const languages = [
    { code: 'en', name: 'English', sample: 'Hello World' },
    { code: 'fr', name: 'Français', sample: 'Bonjour le monde' },
    { code: 'es', name: 'Español', sample: 'Hola Mundo' },
    { code: 'de', name: 'Deutsch', sample: 'Hallo Welt' },
    { code: 'ar', name: 'العربية', sample: 'مرحبا بالعالم' },
    { code: 'zh', name: '中文', sample: '你好世界' },
    { code: 'ja', name: '日本語', sample: 'こんにちは世界' },
    { code: 'hi', name: 'हिन्दी', sample: 'नमस्ते दुनिया' }
  ]

  test.describe('Font Rendering', () => {
    languages.forEach(lang => {
      test(`should render ${lang.name} fonts correctly`, async ({ page }) => {
        await page.goto('/')
        
        // Switch to the test language
        const languageSelector = page.getByRole('button', { name: /language/i })
        await languageSelector.click()
        await page.getByText(lang.name).click()
        
        // Add test content to verify font rendering
        await page.evaluate((sample) => {
          const testDiv = document.createElement('div')
          testDiv.id = 'font-test'
          testDiv.style.cssText = `
            font-size: 24px;
            padding: 20px;
            margin: 20px;
            border: 1px solid #ccc;
            background: white;
          `
          testDiv.textContent = sample
          document.body.appendChild(testDiv)
        }, lang.sample)
        
        // Take screenshot for visual comparison
        await expect(page.locator('#font-test')).toHaveScreenshot(`font-${lang.code}.png`)
        
        // Clean up
        await page.evaluate(() => {
          const testDiv = document.getElementById('font-test')
          if (testDiv) testDiv.remove()
        })
      })
    })
  })

  test.describe('RTL Layout', () => {
    test('should render RTL layout correctly', async ({ page }) => {
      await page.goto('/')
      
      // Switch to Arabic
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('العربية').click()
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('rtl-layout-full.png', { fullPage: true })
      
      // Test specific RTL components
      await expect(page.locator('nav')).toHaveScreenshot('rtl-navigation.png')
      await expect(page.locator('main')).toHaveScreenshot('rtl-content.png')
    })

    test('should render RTL forms correctly', async ({ page }) => {
      await page.goto('/contact')
      
      // Switch to Arabic
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('العربية').click()
      
      // Take screenshot of form in RTL
      await expect(page.locator('form')).toHaveScreenshot('rtl-form.png')
    })
  })

  test.describe('Language Selector', () => {
    test('should render language selector consistently', async ({ page }) => {
      await page.goto('/')
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      
      // Closed state
      await expect(languageSelector).toHaveScreenshot('language-selector-closed.png')
      
      // Open state
      await languageSelector.click()
      await expect(page.getByRole('listbox')).toHaveScreenshot('language-selector-open.png')
    })

    test('should render language selector on mobile', async ({ page, browserName }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      
      // Mobile closed state
      await expect(languageSelector).toHaveScreenshot(`language-selector-mobile-closed-${browserName}.png`)
      
      // Mobile open state
      await languageSelector.click()
      await expect(page.getByRole('listbox')).toHaveScreenshot(`language-selector-mobile-open-${browserName}.png`)
    })
  })

  test.describe('Cross-Browser Consistency', () => {
    const testCases = [
      { name: 'Homepage', url: '/' },
      { name: 'About Page', url: '/about' },
      { name: 'Contact Form', url: '/contact' }
    ]

    testCases.forEach(testCase => {
      test(`should render ${testCase.name} consistently across browsers`, async ({ page, browserName }) => {
        await page.goto(testCase.url)
        
        // Test in multiple languages
        const testLanguages = ['en', 'fr', 'ar']
        
        for (const langCode of testLanguages) {
          if (langCode !== 'en') {
            const languageSelector = page.getByRole('button', { name: /language/i })
            await languageSelector.click()
            
            const langMap = { fr: 'Français', ar: 'العربية' }
            await page.getByText(langMap[langCode as keyof typeof langMap]).click()
          }
          
          // Take screenshot for each browser/language combination
          await expect(page).toHaveScreenshot(
            `${testCase.name.toLowerCase().replace(' ', '-')}-${langCode}-${browserName}.png`,
            { fullPage: true }
          )
        }
      })
    })
  })

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ]

    viewports.forEach(viewport => {
      test(`should render correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/')
        
        // Test language selector at different viewport sizes
        const languageSelector = page.getByRole('button', { name: /language/i })
        await expect(languageSelector).toHaveScreenshot(`language-selector-${viewport.name}.png`)
        
        // Test full page layout
        await expect(page).toHaveScreenshot(`layout-${viewport.name}.png`, { fullPage: true })
      })
    })
  })

  test.describe('Dark Mode', () => {
    test('should render correctly in dark mode', async ({ page }) => {
      // Enable dark mode
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.goto('/')
      
      // Test language selector in dark mode
      const languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toHaveScreenshot('language-selector-dark.png')
      
      await languageSelector.click()
      await expect(page.getByRole('listbox')).toHaveScreenshot('language-dropdown-dark.png')
      
      // Test full page in dark mode
      await expect(page).toHaveScreenshot('full-page-dark.png', { fullPage: true })
    })
  })

  test.describe('High Contrast Mode', () => {
    test('should render correctly in high contrast mode', async ({ page }) => {
      // Simulate high contrast mode
      await page.addInitScript(() => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: (query: string) => ({
            matches: query.includes('prefers-contrast: high'),
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => {},
          }),
        })
      })
      
      await page.goto('/')
      
      // Test high contrast rendering
      const languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toHaveScreenshot('language-selector-high-contrast.png')
      
      await languageSelector.click()
      await expect(page.getByRole('listbox')).toHaveScreenshot('language-dropdown-high-contrast.png')
    })
  })

  test.describe('Animation States', () => {
    test('should capture animation states', async ({ page }) => {
      await page.goto('/')
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      
      // Hover state
      await languageSelector.hover()
      await expect(languageSelector).toHaveScreenshot('language-selector-hover.png')
      
      // Focus state
      await languageSelector.focus()
      await expect(languageSelector).toHaveScreenshot('language-selector-focus.png')
      
      // Active state
      await languageSelector.click()
      await expect(page.getByRole('listbox')).toHaveScreenshot('language-dropdown-opening.png')
    })

    test('should respect reduced motion preferences', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      
      // Should render without animations
      await expect(page.getByRole('listbox')).toHaveScreenshot('language-dropdown-no-animation.png')
    })
  })
})