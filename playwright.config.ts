import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile Chrome
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tablets
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },

    // RTL testing
    {
      name: 'RTL Desktop',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ar-SA',
      },
    },
    {
      name: 'RTL Mobile',
      use: {
        ...devices['iPhone 12'],
        locale: 'ar-SA',
      },
    },

    // High DPI testing
    {
      name: 'High DPI',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 2,
      },
    },

    // Slow network testing
    {
      name: 'Slow 3G',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--simulate-slow-connection']
        }
      },
    },

    // Accessibility testing
    {
      name: 'Accessibility',
      use: {
        ...devices['Desktop Chrome'],
        reducedMotion: 'reduce',
        colorScheme: 'dark',
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})