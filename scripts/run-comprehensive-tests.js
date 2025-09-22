#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🧪 Running Comprehensive Multi-Language Support Tests\n')

// Ensure test results directory exists
const testResultsDir = path.join(__dirname, '..', 'test-results')
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true })
}

// Test configurations
const testSuites = [
  {
    name: 'Unit Tests',
    command: 'npm run test:coverage',
    description: 'Translation service, language detection, and core functionality'
  },
  {
    name: 'Integration Tests',
    command: 'npm run test -- --run lib/i18n/__tests__/integration.test.ts',
    description: 'Language switching and URL routing integration'
  },
  {
    name: 'Accessibility Tests',
    command: 'npm run test -- --run lib/i18n/__tests__/accessibility.test.ts',
    description: 'Screen reader support and keyboard navigation'
  },
  {
    name: 'Performance Tests',
    command: 'npm run test -- --run lib/i18n/__tests__/performance.test.ts',
    description: 'Translation loading and caching performance'
  },
  {
    name: 'Cross-Browser E2E Tests',
    command: 'npx playwright test e2e/cross-browser.spec.ts',
    description: 'Language detection across different browsers'
  },
  {
    name: 'Mobile Device Tests',
    command: 'npx playwright test e2e/mobile-device.spec.ts',
    description: 'Touch interactions and responsive design'
  },
  {
    name: 'Language Switching E2E',
    command: 'npx playwright test e2e/language-switching.spec.ts',
    description: 'End-to-end language switching workflows'
  }
]

// Browser-specific tests
const browsers = ['chromium', 'firefox', 'webkit']
const mobileDevices = ['Mobile Chrome', 'Mobile Safari', 'iPad']

let totalTests = 0
let passedTests = 0
let failedTests = 0
const results = []

function runCommand(command, description) {
  console.log(`\n📋 Running: ${description}`)
  console.log(`Command: ${command}`)
  
  try {
    const startTime = Date.now()
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    })
    const duration = Date.now() - startTime
    
    console.log('✅ PASSED')
    console.log(`Duration: ${duration}ms`)
    
    passedTests++
    results.push({
      name: description,
      status: 'PASSED',
      duration,
      output: output.slice(-500) // Last 500 chars
    })
    
    return true
  } catch (error) {
    console.log('❌ FAILED')
    console.log(`Error: ${error.message}`)
    
    failedTests++
    results.push({
      name: description,
      status: 'FAILED',
      error: error.message,
      output: error.stdout?.slice(-500) || ''
    })
    
    return false
  }
}

// Run all test suites
console.log('Starting test execution...\n')

for (const suite of testSuites) {
  totalTests++
  runCommand(suite.command, `${suite.name}: ${suite.description}`)
}

// Run browser-specific tests
for (const browser of browsers) {
  totalTests++
  const command = `npx playwright test --project=${browser} e2e/language-switching.spec.ts`
  runCommand(command, `Language Detection - ${browser}`)
}

// Run mobile device tests
for (const device of mobileDevices) {
  totalTests++
  const command = `npx playwright test --project="${device}" e2e/mobile-device.spec.ts`
  runCommand(command, `Mobile Testing - ${device}`)
}

// Generate comprehensive report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    successRate: ((passedTests / totalTests) * 100).toFixed(2) + '%'
  },
  results: results,
  environment: {
    node: process.version,
    platform: process.platform,
    arch: process.arch
  }
}

// Save detailed report
const reportPath = path.join(testResultsDir, 'comprehensive-test-report.json')
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

// Generate HTML report
const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Multi-Language Support Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .test-result { margin: 10px 0; padding: 10px; border-left: 4px solid #ddd; }
        .test-result.passed { border-left-color: #28a745; }
        .test-result.failed { border-left-color: #dc3545; }
        .details { font-size: 0.9em; color: #666; margin-top: 5px; }
    </style>
</head>
<body>
    <h1>Multi-Language Support Test Report</h1>
    
    <div class="summary">
        <h2>Test Summary</h2>
        <p><strong>Total Tests:</strong> ${report.summary.total}</p>
        <p><strong>Passed:</strong> <span class="passed">${report.summary.passed}</span></p>
        <p><strong>Failed:</strong> <span class="failed">${report.summary.failed}</span></p>
        <p><strong>Success Rate:</strong> ${report.summary.successRate}</p>
        <p><strong>Generated:</strong> ${report.timestamp}</p>
    </div>
    
    <h2>Test Results</h2>
    ${results.map(result => `
        <div class="test-result ${result.status.toLowerCase()}">
            <strong>${result.name}</strong>
            <span class="${result.status.toLowerCase()}">[${result.status}]</span>
            ${result.duration ? `<div class="details">Duration: ${result.duration}ms</div>` : ''}
            ${result.error ? `<div class="details">Error: ${result.error}</div>` : ''}
        </div>
    `).join('')}
    
    <h2>Environment</h2>
    <ul>
        <li>Node.js: ${report.environment.node}</li>
        <li>Platform: ${report.environment.platform}</li>
        <li>Architecture: ${report.environment.arch}</li>
    </ul>
</body>
</html>
`

const htmlReportPath = path.join(testResultsDir, 'test-report.html')
fs.writeFileSync(htmlReportPath, htmlReport)

// Print final summary
console.log('\n' + '='.repeat(60))
console.log('📊 COMPREHENSIVE TEST SUMMARY')
console.log('='.repeat(60))
console.log(`Total Tests: ${totalTests}`)
console.log(`Passed: ${passedTests} ✅`)
console.log(`Failed: ${failedTests} ❌`)
console.log(`Success Rate: ${report.summary.successRate}`)
console.log(`\nDetailed reports saved to:`)
console.log(`- JSON: ${reportPath}`)
console.log(`- HTML: ${htmlReportPath}`)

if (failedTests > 0) {
  console.log('\n⚠️  Some tests failed. Check the detailed report for more information.')
  process.exit(1)
} else {
  console.log('\n🎉 All tests passed successfully!')
  process.exit(0)
}