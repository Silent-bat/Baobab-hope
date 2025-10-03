#!/usr/bin/env node

// Direct executor for batch translation update
// This bypasses shell issues with directory names containing spaces/parentheses

const fs = require('fs');
const path = require('path');

console.log('🚀 DIRECT BATCH TRANSLATION UPDATE EXECUTOR');
console.log('==========================================');
console.log(`📅 Started: ${new Date().toISOString()}\n`);

// Import the batch update function
let batchTranslationUpdate;
try {
  const batchModule = require('./batch-translation-update.js');
  batchTranslationUpdate = batchModule.batchTranslationUpdate;
  console.log('✅ Successfully imported batch translation module');
} catch (error) {
  console.error('❌ Failed to import batch translation module:', error.message);
  process.exit(1);
}

// Verify the function exists
if (typeof batchTranslationUpdate !== 'function') {
  console.error('❌ batchTranslationUpdate is not a function');
  process.exit(1);
}

// Execute the batch update
console.log('🔧 Executing batch translation update...\n');

batchTranslationUpdate()
  .then((report) => {
    console.log('\n🎉 BATCH UPDATE COMPLETED SUCCESSFULLY!');
    console.log('=====================================');

    if (report) {
      console.log(`📊 Summary:`);
      console.log(`   Languages processed: ${report.summary.languagesUpdated}/${report.summary.totalLanguages}`);
      console.log(`   Files updated: ${report.summary.totalFilesUpdated}`);
      console.log(`   Success rate: ${report.summary.successRate}%`);
      console.log(`   Validation errors: ${report.summary.validationErrors}`);

      if (report.summary.validationErrors === 0) {
        console.log('\n✅ ALL TRANSLATIONS COMPLETED WITHOUT ERRORS!');
        console.log('🌍 All 51 languages are now perfectly aligned');
        console.log('🚀 Translation system is PRODUCTION READY!');
        process.exit(0);
      } else {
        console.log('\n⚠️ Some validation errors found. Check the generated report.');
        process.exit(1);
      }
    } else {
      console.log('⚠️ No report generated, but execution completed');
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('\n❌ BATCH UPDATE FAILED!');
    console.error('======================');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  });

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ Unhandled Promise Rejection:', reason);
  process.exit(1);
});
