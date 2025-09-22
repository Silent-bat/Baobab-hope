# Multi-Language Support Testing Documentation

This document describes the comprehensive testing suite for the multi-language support feature.

## Test Structure

### Unit Tests (`lib/i18n/__tests__/`)

#### Translation Service Tests (`translation-service.test.ts`)
- **Purpose**: Test core translation functionality
- **Coverage**: 
  - Singleton pattern implementation
  - Translation loading and caching
  - Parameter interpolation and pluralization
  - Fallback mechanisms
  - Cache management
- **Requirements Covered**: 1.1, 1.5, 6.1, 7.1

#### Language Detection Tests (`language-detection.test.ts`)
- **Purpose**: Test automatic language detection
- **Coverage**:
  - Browser language detection
  - Geolocation-based detection
  - User preference management
  - Language validation
- **Requirements Covered**: 1.1, 1.5, 6.1

#### Integration Tests (`integration.test.ts`)
- **Purpose**: Test component integration and language switching
- **Coverage**:
  - Language provider integration
  - URL routing with language codes
  - Language persistence
  - Error handling
- **Requirements Covered**: 1.1, 1.5, 6.1, 7.1

#### Accessibility Tests (`accessibility.test.ts`)
- **Purpose**: Test screen reader and keyboard navigation support
- **Coverage**:
  - ARIA attributes and roles
  - Keyboard navigation
  - Screen reader announcements
  - RTL language support
  - Focus management
- **Requirements Covered**: 2.3, 2.4, 7.2, 7.3

#### Performance Tests (`performance.test.ts`)
- **Purpose**: Test translation loading and caching performance
- **Coverage**:
  - Translation loading times
  - Cache performance
  - Memory usage
  - Bundle size impact
- **Requirements Covered**: 1.1, 1.5, 6.1, 7.1

### End-to-End Tests (`e2e/`)

#### Language Switching Tests (`language-switching.spec.ts`)
- **Purpose**: Test complete language switching workflows
- **Coverage**:
  - Language detection from browser settings
  - Language selector interactions
  - URL routing and persistence
  - Content translation
  - Error handling
- **Requirements Covered**: 1.1, 1.5, 6.1, 7.1

#### Cross-Browser Tests (`cross-browser.spec.ts`)
- **Purpose**: Test compatibility across different browsers
- **Coverage**:
  - Chrome, Firefox, Safari compatibility
  - Browser-specific language APIs
  - RTL layout rendering
  - Font rendering for different scripts
  - Performance consistency
- **Requirements Covered**: 2.3, 2.4, 7.2, 7.3

#### Mobile Device Tests (`mobile-device.spec.ts`)
- **Purpose**: Test mobile device compatibility and touch interactions
- **Coverage**:
  - iPhone and Android device testing
  - Touch gestures and interactions
  - Responsive design adaptation
  - Mobile performance
  - Mobile accessibility
- **Requirements Covered**: 2.3, 2.4, 7.2, 7.3

#### Visual Regression Tests (`visual-regression.spec.ts`)
- **Purpose**: Test visual consistency across browsers and devices
- **Coverage**:
  - Font rendering for different scripts
  - RTL layout visual verification
  - Language selector appearance
  - Responsive design consistency
  - Dark mode and high contrast support
- **Requirements Covered**: 2.3, 2.4, 7.2, 7.3

## Running Tests

### Individual Test Suites

```bash
# Unit tests only
npm run test:i18n

# Performance tests
npm run test:performance

# Integration tests
npm run test:integration

# All unit tests with coverage
npm run test:coverage

# Cross-browser E2E tests
npm run test:e2e:cross-browser

# Mobile device tests
npm run test:e2e:mobile

# Visual regression tests
npm run test:e2e:visual

# All E2E tests
npm run test:e2e
```

### Comprehensive Test Suite

```bash
# Run all tests with detailed reporting
npm run test:comprehensive
```

This command runs:
1. All unit tests with coverage
2. Integration tests
3. Accessibility tests
4. Performance tests
5. Cross-browser E2E tests
6. Mobile device tests
7. Language switching workflows

### Browser-Specific Testing

```bash
# Test specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Test specific mobile device
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
npx playwright test --project="iPad"
```

### Test Configuration

#### Vitest Configuration (`vitest.config.ts`)
- Environment: jsdom for DOM testing
- Setup files for mocking browser APIs
- Coverage reporting with v8 provider
- Path aliases for imports

#### Playwright Configuration (`playwright.config.ts`)
- Multiple browser projects (Chrome, Firefox, Safari)
- Mobile device emulation
- RTL language testing
- Network condition simulation
- Accessibility testing setup

## Test Reports

### Coverage Reports
- **Location**: `coverage/`
- **Formats**: HTML, JSON, text
- **Threshold**: 80% minimum coverage

### E2E Test Reports
- **Location**: `test-results/`
- **Formats**: HTML, JSON, JUnit XML
- **Screenshots**: On failure only
- **Videos**: Retained on failure

### Comprehensive Test Report
- **Location**: `test-results/comprehensive-test-report.json`
- **HTML Report**: `test-results/test-report.html`
- **Includes**: All test results, performance metrics, environment info

## Test Data and Fixtures

### Mock Data
- Browser language preferences
- Geolocation coordinates
- Translation files
- User preferences

### Test Languages
- **Latin Scripts**: English, French, Spanish, German
- **RTL Scripts**: Arabic, Hebrew
- **CJK Scripts**: Chinese, Japanese, Korean
- **Complex Scripts**: Hindi, Thai, Bengali

## Continuous Integration

### GitHub Actions Workflow
```yaml
- name: Run Unit Tests
  run: npm run test:coverage

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Test Matrix
- **Browsers**: Chrome, Firefox, Safari
- **Devices**: Desktop, Mobile, Tablet
- **Languages**: 8+ languages covering different scripts
- **Network**: Fast, Slow 3G, Offline

## Performance Benchmarks

### Translation Loading
- **Target**: < 200ms for cached translations
- **Target**: < 2s for initial load
- **Measurement**: Performance API timing

### Cache Performance
- **Target**: < 5ms for cache writes
- **Target**: < 2ms for cache reads
- **Memory**: < 10MB increase per 10k operations

### Mobile Performance
- **Target**: < 5s initial page load
- **Target**: < 3s language switching
- **Memory**: Stable across multiple switches

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: All interactive elements
- **Screen Reader**: Proper ARIA labels and roles
- **Color Contrast**: 4.5:1 minimum ratio
- **Focus Management**: Visible focus indicators

### Testing Tools
- **axe-core**: Automated accessibility testing
- **Playwright**: Keyboard navigation testing
- **Manual Testing**: Screen reader verification

## Troubleshooting

### Common Issues

#### Test Timeouts
- Increase timeout in playwright.config.ts
- Check network conditions
- Verify test server is running

#### Font Rendering Failures
- Update browser versions
- Check font loading in CSS
- Verify font files are accessible

#### Mobile Test Failures
- Check device emulation settings
- Verify touch event handling
- Test on actual devices when possible

### Debug Commands

```bash
# Run tests in debug mode
npx playwright test --debug

# Run with headed browser
npx playwright test --headed

# Generate test report
npx playwright show-report
```

## Maintenance

### Regular Tasks
- Update browser versions monthly
- Review and update test data quarterly
- Performance benchmark reviews
- Accessibility audit reviews

### Test Updates
- Add tests for new languages
- Update visual regression baselines
- Review and update performance thresholds
- Expand device coverage as needed