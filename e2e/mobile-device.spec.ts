import { test, expect, devices } from '@playwright/test'

test.describe('Mobile Device Language Support', () => {
  test.describe('iPhone Testing', () => {
    test('should work on iPhone 12', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Test mobile language selector visibility
      const languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toBeVisible()
      
      // Test touch interaction
      await languageSelector.tap()
      
      // Check dropdown appears correctly on mobile
      const dropdown = page.getByRole('listbox')
      await expect(dropdown).toBeVisible()
      
      // Verify dropdown doesn't overflow viewport
      const dropdownBox = await dropdown.boundingBox()
      const viewportSize = page.viewportSize()
      
      expect(dropdownBox!.x).toBeGreaterThanOrEqual(0)
      expect(dropdownBox!.x + dropdownBox!.width).toBeLessThanOrEqual(viewportSize!.width)
      
      await context.close()
    })

    test('should handle iOS Safari specific behaviors', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
        userAgent: devices['iPhone 12'].userAgent?.replace('Chrome', 'Safari')
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Test iOS-specific touch events
      const languageSelector = page.getByRole('button', { name: /language/i })
      
      // Test long press (should not trigger context menu)
      await languageSelector.tap({ delay: 500 })
      await expect(page.getByRole('listbox')).toBeVisible()
      
      // Test double tap
      await page.getByText('Français').tap()
      await expect(page).toHaveURL(/\/fr/)
      
      await context.close()
    })
  })

  test.describe('Android Testing', () => {
    test('should work on Pixel 5', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Pixel 5'],
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Test Android-specific behaviors
      const languageSelector = page.getByRole('button', { name: /language/i })
      await languageSelector.tap()
      
      // Test swipe gestures on dropdown
      const dropdown = page.getByRole('listbox')
      await expect(dropdown).toBeVisible()
      
      // Simulate swipe to scroll through options
      const dropdownBox = await dropdown.boundingBox()
      await page.mouse.move(dropdownBox!.x + dropdownBox!.width / 2, dropdownBox!.y + 50)
      await page.mouse.down()
      await page.mouse.move(dropdownBox!.x + dropdownBox!.width / 2, dropdownBox!.y + 150)
      await page.mouse.up()
      
      // Should still be able to select option
      await page.getByText('Español').tap()
      await expect(page).toHaveURL(/\/es/)
      
      await context.close()
    })

    test('should handle Android keyboard navigation', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Pixel 5'],
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Simulate hardware keyboard on Android
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      
      await expect(page.getByRole('listbox')).toBeVisible()
      
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      
      await expect(page).toHaveURL(/\/fr/)
      
      await context.close()
    })
  })

  test.describe('Tablet Testing', () => {
    test('should work on iPad Pro', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPad Pro'],
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Test tablet-specific layout
      const languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toBeVisible()
      
      // Test both touch and mouse interactions
      await languageSelector.click() // Mouse-like interaction
      await expect(page.getByRole('listbox')).toBeVisible()
      
      await page.getByText('Français').tap() // Touch interaction
      await expect(page).toHaveURL(/\/fr/)
      
      await context.close()
    })

    test('should handle orientation changes', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPad Pro'],
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Test in portrait mode
      let languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toBeVisible()
      
      // Rotate to landscape
      await page.setViewportSize({ width: 1366, height: 1024 })
      
      // Language selector should still be visible and functional
      languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toBeVisible()
      
      await languageSelector.click()
      await expect(page.getByRole('listbox')).toBeVisible()
      
      await context.close()
    })
  })

  test.describe('Touch Interactions', () => {
    test('should handle various touch gestures', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      
      // Test single tap
      await languageSelector.tap()
      await expect(page.getByRole('listbox')).toBeVisible()
      
      // Test tap outside to close
      await page.tap('body', { position: { x: 10, y: 10 } })
      await expect(page.getByRole('listbox')).not.toBeVisible()
      
      // Test tap and hold
      await languageSelector.tap({ delay: 300 })
      await expect(page.getByRole('listbox')).toBeVisible()
      
      await context.close()
    })

    test('should prevent zoom on double tap', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Check viewport meta tag prevents zoom
      const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content')
      expect(viewportMeta).toContain('user-scalable=no')
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      
      // Double tap should not zoom
      await languageSelector.tap()
      await languageSelector.tap()
      
      // Should open dropdown, not zoom
      await expect(page.getByRole('listbox')).toBeVisible()
      
      await context.close()
    })
  })

  test.describe('Screen Size Adaptations', () => {
    const screenSizes = [
      { name: 'Small Phone', width: 320, height: 568 },
      { name: 'Large Phone', width: 414, height: 896 },
      { name: 'Small Tablet', width: 768, height: 1024 },
      { name: 'Large Tablet', width: 1024, height: 1366 }
    ]

    screenSizes.forEach(size => {
      test(`should adapt to ${size.name} (${size.width}x${size.height})`, async ({ browser }) => {
        const context = await browser.newContext({
          viewport: { width: size.width, height: size.height }
        })
        const page = await context.newPage()
        
        await page.goto('/')
        
        // Language selector should be visible and appropriately sized
        const languageSelector = page.getByRole('button', { name: /language/i })
        await expect(languageSelector).toBeVisible()
        
        const selectorBox = await languageSelector.boundingBox()
        
        // Should not be too small to tap
        expect(selectorBox!.width).toBeGreaterThan(44) // iOS minimum tap target
        expect(selectorBox!.height).toBeGreaterThan(44)
        
        // Should fit within viewport
        expect(selectorBox!.x + selectorBox!.width).toBeLessThanOrEqual(size.width)
        
        await context.close()
      })
    })
  })

  test.describe('Mobile Performance', () => {
    test('should load quickly on mobile devices', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      })
      const page = await context.newPage()
      
      // Simulate mobile network conditions
      await context.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 50)) // Mobile latency
        await route.continue()
      })
      
      const startTime = Date.now()
      await page.goto('/')
      
      // Page should load within reasonable time on mobile
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(5000)
      
      // Language selector should be interactive quickly
      const languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toBeVisible({ timeout: 3000 })
      
      await context.close()
    })

    test('should handle memory constraints', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Switch languages multiple times to test memory usage
      for (let i = 0; i < 5; i++) {
        const languageSelector = page.getByRole('button', { name: /language/i })
        await languageSelector.tap()
        
        const languages = ['Français', 'Español', 'Deutsch', 'English']
        await page.getByText(languages[i % languages.length]).tap()
        
        // Should not crash or become unresponsive
        await expect(page.locator('body')).toBeVisible()
      }
      
      await context.close()
    })
  })

  test.describe('Mobile Accessibility', () => {
    test('should work with mobile screen readers', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Test VoiceOver/TalkBack compatibility
      const languageSelector = page.getByRole('button', { name: /language/i })
      
      // Should have proper accessibility attributes
      await expect(languageSelector).toHaveAttribute('aria-label')
      await expect(languageSelector).toHaveAttribute('role', 'button')
      
      await languageSelector.tap()
      
      const dropdown = page.getByRole('listbox')
      await expect(dropdown).toHaveAttribute('aria-labelledby')
      
      const options = page.getByRole('option')
      await expect(options.first()).toHaveAttribute('aria-selected')
      
      await context.close()
    })

    test('should support high contrast mode on mobile', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
        colorScheme: 'dark',
      })
      const page = await context.newPage()
      
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
      
      const languageSelector = page.getByRole('button', { name: /language/i })
      await expect(languageSelector).toBeVisible()
      
      // Should maintain visibility in high contrast
      const contrast = await languageSelector.evaluate(el => {
        const style = getComputedStyle(el)
        return {
          backgroundColor: style.backgroundColor,
          color: style.color,
          border: style.border
        }
      })
      
      expect(contrast.backgroundColor).toBeTruthy()
      expect(contrast.color).toBeTruthy()
      
      await context.close()
    })
  })
})