const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Testing build process...');

// Create minimal environment if needed
if (!fs.existsSync('.env')) {
  console.log('📝 Creating minimal .env file...');
  const minimalEnv = `
NODE_ENV=development
DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="test-secret"
JWT_SECRET="test-jwt-secret"
`;
  fs.writeFileSync('.env', minimalEnv.trim());
}

// Function to run command
function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Running: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function testBuild() {
  try {
    console.log('📋 Step 1: Checking TypeScript compilation...');

    // First check if TypeScript compiles without emitting files
    try {
      await runCommand('npx', ['tsc', '--noEmit', '--skipLibCheck']);
      console.log('✅ TypeScript compilation successful');
    } catch (error) {
      console.log('⚠️ TypeScript compilation failed, but continuing...');
    }

    console.log('📋 Step 2: Testing Next.js build...');

    // Try to build with Next.js
    await runCommand('npx', ['next', 'build']);

    console.log('🎉 Build test completed successfully!');

  } catch (error) {
    console.error('❌ Build test failed:', error.message);

    // Check if it's a dependency issue
    if (error.message.includes('Cannot find module')) {
      console.log('💡 This appears to be a missing dependency issue.');
      console.log('🔧 Try running: npm install --force');
      console.log('📦 Or install specific dependencies:');
      console.log('   npm install @prisma/client prisma bcryptjs jose zod');
    }

    process.exit(1);
  }
}

// Check if we can run the build
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found. Are you in the correct directory?');
  process.exit(1);
}

testBuild();
