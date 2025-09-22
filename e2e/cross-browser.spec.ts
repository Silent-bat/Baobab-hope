import { test, expect, devices } from '@playwright/test'

// Test across different browsers and devices
const browsers = ['chromium', 'firefox', 'webkit']
const mobileDevices = [
  devices['iPhone 12'],
  devices['Pixel 5'],
  devices['iPad Pro']
]

test.describe('Cross-Browser Language Detection', () => {
  browsers.forEach(browserName => {
    test(`should detect language correctly in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
      test.skip(currentBrowser !== browserName, `Skipping ${browserName} test`)
      
      await page.goto('/')
      
      // Test browser language detection
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'language', {
          get: () => 'es-ES'
        })
        Object.defineProperty(navigator, 'languages', {
          get: () => ['es-ES', 'es', 'en-US']
        })
      })
      
      await page.reload()
      
      // Should detect Spanish
      await expect(page).toHaveURL(/\/es/)
    })
  })

  test('should handle browser-specific language APIs', async ({ page, browserName }) => {
    await page.goto('/')
    
    // Test different browser implementations
    const languageInfo = await page.evaluate(() => {
      return {
        language: navigator.language,
        languages: navigator.languages,
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    })
    
    expect(languageInfo.language).toBeTruthy()
    expect(Array.isArray(languageInfo.languages)).toBe(true)
  })
})

test.describe('Mobile Device Testing', () => {
  mobileDevices.forEach(device => {
    test(`should work on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Test mobile language selector
      const languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toBeVisible()
      
      // Test touch interaction
      await languageSelector.tap()
      await expect(page.getByRole('listbox')).toBeVisible()
      
      // Test mobile-specific gestures
      await page.getByText('Français').tap()
      await expect(page).toHaveURL(/\/fr/)
      
      await context.close()
    })
  })

  test('should handle mobile viewport changes', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 } // iPhone SE size
    })
    const page = await context.newPage()
    
    await page.goto('/')
    
    // Test in portrait mode
    const languageSelector = page.getByRole('button', { name: /language/i })
    await expect(languageSelector).toBeVisible()
    
    // Rotate to landscape
    await page.setViewportSize({ width: 667, height: 375 })
    await expect(languageSelector).toBeVisible()
    
    await context.close()
  })
})

test.describe('RTL Layout Cross-Browser', () => {
  browsers.forEach(browserName => {
    test(`should render RTL correctly in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
      test.skip(currentBrowser !== browserName, `Skipping ${browserName} test`)
      
      await page.goto('/')
      
      // Switch to Arabic
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('العربية').click()
      
      // Check RTL attributes
      const htmlElement = page.locator('html')
      await expect(htmlElement).toHaveAttribute('dir', 'rtl')
      await expect(htmlElement).toHaveAttribute('lang', 'ar')
      
      // Check text alignment in different browsers
      const mainContent = page.locator('main')
      const computedStyle = await mainContent.evaluate(el => {
        const style = getComputedStyle(el)
        return {
          direction: style.direction,
          textAlign: style.textAlign,
          unicodeBidi: style.unicodeBidi
        }
      })
      
      expect(computedStyle.direction).toBe('rtl')
    })
  })
})

test.describe('Font Rendering Cross-Browser', () => {
  const testLanguages = [
    { code: 'ar', name: 'العربية', script: 'Arabic' },
    { code: 'zh', name: '中文', script: 'Chinese' },
    { code: 'ja', name: '日本語', script: 'Japanese' },
    { code: 'hi', name: 'हिन्दी', script: 'Devanagari' }
  ]

  testLanguages.forEach(lang => {
    test(`should render ${lang.script} fonts correctly`, async ({ page, browserName }) => {
      await page.goto('/')
      
      // Switch to the test language
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText(lang.name).click()
      
      // Check font rendering
      const textElement = page.locator('body')
      const fontInfo = await textElement.evaluate(el => {
        const style = getComputedStyle(el)
        return {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight
        }
      })
      
      expect(fontInfo.fontFamily).toBeTruthy()
      expect(fontInfo.fontSize).toBeTruthy()
      
      // Take screenshot for visual regression testing
      await page.screenshot({ 
        path: `test-results/font-${lang.code}-${browserName}.png`,
        fullPage: true 
      })
    })
  })
})

test.describe('Performance Across Browsers', () => {
  browsers.forEach(browserName => {
    test(`should load translations quickly in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
      test.skip(currentBrowser !== browserName, `Skipping ${browserName} test`)
      
      await page.goto('/')
      
      // Measure translation loading time
      const startTime = Date.now()
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.click()
      await page.getByText('Français').click()
      
      // Wait for content to be translated
      await expect(page.getByText(/accueil/i)).toBeVisible()
      
      const loadTime = Date.now() - startTime
      
      // Performance should be consistent across browsers
      expect(loadTime).toBeLessThan(3000)
      
      console.log(`${browserName} translation load time: ${loadTime}ms`)
    })
  })
})

test.describe('Accessibility Across Browsers', () => {
  browsers.forEach(browserName => {
    test(`should be accessible in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
      test.skip(currentBrowser !== browserName, `Skipping ${browserName} test`)
      
      await page.goto('/')
      
      // Test keyboard navigation
      await page.keyboard.press('Tab')
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBeTruthy()
      
      // Test screen reader attributes
      const languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toHaveAttribute('aria-haspopup')
      await expect(languageSelector).toHaveAttribute('aria-expanded')
      
      // Test with different accessibility settings
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await languageSelector.click()
      await expect(page.getByRole('listbox')).toBeVisible()
    })
  })
})

test.describe('Network Conditions Testing', () => {
  test('should work on slow 3G connection', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)) // Add delay
      await route.continue()
    })
    
    await page.goto('/')
    
    const languageSelector = page.getByRole('button', { name: /language/i })
    await languageSelector.click()
    await page.getByText('Français').click()
    
    // Should still work, just slower
    await expect(page).toHaveURL(/\/fr/, { timeout: 10000 })
  })

  test('should handle offline scenarios', async ({ page, context }) => {
    await page.goto('/')
    
    // Go offline
    await context.setOffline(true)
    
    const languageSelector = page.getByRole('button', { name: /language/i })
    await languageSelector.click()
    
    // Should show cached languages or graceful degradation
    await expect(page.getByRole('listbox')).toBeVisible()
  })
})

test.describe('Browser Storage Testing', () => {
  test('should persist language preference in localStorage', async ({ page }) => {
    await page.goto('/')
    
    // Change language
    const languageSelector = page.getByRole('button', { name: /language/i })
    await languageSelector.click()
    await page.getByText('Español').click()
    
    // Check localStorage
    const storedLanguage = await page.evaluate(() => 
      localStorage.getItem('preferred-language')
    )
    expect(storedLanguage).toBe('es')
    
    // Reload page
    await page.reload()
    
    // Should maintain Spanish
    await expect(page).toHaveURL(/\/es/)
  })

  test('should handle localStorage quota exceeded', async ({ page }) => {
    await page.goto('/')
    
    // Fill localStorage to capacity
    await page.evaluate(() => {
      try {
        for (let i = 0; i < 1000; i++) {
          localStorage.setItem(`test-${i}`, 'x'.repeat(1000))
        }
      } catch (e) {
        // Quota exceeded
      }
    })
    
    // Language switching should still work
    const languageSelector = page.getByRole('button', { name: /language/i })
    await languageSelector.click()
    await page.getByText('Français').click()
    
    await expect(page).toHaveURL(/\/fr/)
  })
})

test.describe('Security Testing', () => {
  test('should sanitize language codes from URL', async ({ page }) => {
    // Try XSS in language code
    await page.goto('/"><script>alert("xss")</script>/about')
    
    // Should redirect to safe URL
    await expect(page).toHaveURL(/\/en\/about/)
  })

  test('should validate language preferences', async ({ page }) => {
    await page.goto('/')
    
    // Try to set invalid language preference
    await page.evaluate(() => {
      localStorage.setItem('preferred-language', '<script>alert("xss")</script>')
    })
    
    await page.reload()
    
    // Should fallback to default language
    await expect(page).toHaveURL(/\/en/)
  })
})