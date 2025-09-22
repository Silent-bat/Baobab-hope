import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    language: 'en-US',
    languages: ['en-US', 'en', 'fr'],
    geolocation: {
      getCurrentPosition: vi.fn()
    }
  },
  writable: true
})

// Mock Intl
global.Intl = {
  ...Intl,
  DateTimeFormat: vi.fn().mockImplementation((locale, options) => ({
    format: vi.fn().mockReturnValue('1/15/2024'),
    formatToParts: vi.fn().mockReturnValue([])
  })),
  NumberFormat: vi.fn().mockImplementation((locale, options) => ({
    format: vi.fn().mockReturnValue('1,234.56'),
    formatToParts: vi.fn().mockReturnValue([])
  }))
}

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})