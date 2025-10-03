#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 BATCH TRANSLATION UPDATE WRAPPER');
console.log('===================================');

// Get the current directory
const currentDir = process.cwd();
console.log(`📍 Working directory: ${currentDir}`);

// Execute the batch translation update script
const scriptPath = path.join(currentDir, 'batch-translation-update.js');

console.log(`🔧 Executing: node ${scriptPath}\n`);

const child = spawn('node', [scriptPath], {
  cwd: currentDir,
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log(`\n✅ Process finished with exit code: ${code}`);
  if (code === 0) {
    console.log('🎉 Batch translation update completed successfully!');
  } else {
    console.log('⚠️ Batch translation update completed with issues.');
  }
  process.exit(code);
});

child.on('error', (error) => {
  console.error('❌ Failed to start batch translation update:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, terminating...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, terminating...');
  child.kill('SIGTERM');
});
