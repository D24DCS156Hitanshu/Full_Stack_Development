const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying Furniture Estimator Setup\n')
console.log('=' .repeat(50))

let allGood = true

// Check 1: Database file
console.log('\n1. Checking database file...')
const dbFile = path.join(__dirname, 'data', 'furniture.json')
if (fs.existsSync(dbFile)) {
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))
  console.log(`   ✅ Database file exists`)
  console.log(`   ✅ Contains ${data.length} furniture items`)
} else {
  console.log('   ❌ Database file not found')
  allGood = false
}

// Check 2: Upload directories
console.log('\n2. Checking upload directories...')
const modelsDir = path.join(__dirname, 'public', 'uploads', 'models')
const imagesDir = path.join(__dirname, 'public', 'uploads', 'images')

if (fs.existsSync(modelsDir)) {
  console.log('   ✅ Models directory exists')
} else {
  console.log('   ❌ Models directory not found')
  allGood = false
}

if (fs.existsSync(imagesDir)) {
  console.log('   ✅ Images directory exists')
} else {
  console.log('   ❌ Images directory not found')
  allGood = false
}

// Check 3: Required files
console.log('\n3. Checking required files...')
const requiredFiles = [
  'lib/db.ts',
  'lib/storage.ts',
  'app/api/furniture/route.ts',
  'app/api/furniture/[id]/route.ts',
  'app/api/upload/route.ts',
  'components/admin/add-furniture-modal.tsx'
]

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file)
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`)
  } else {
    console.log(`   ❌ ${file} not found`)
    allGood = false
  }
})

// Check 4: Node modules
console.log('\n4. Checking dependencies...')
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('   ✅ Dependencies installed')
} else {
  console.log('   ❌ Dependencies not installed')
  console.log('   Run: npm install --legacy-peer-deps')
  allGood = false
}

// Check 5: Package.json scripts
console.log('\n5. Checking package.json scripts...')
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'))
if (packageJson.scripts.dev) {
  console.log('   ✅ Dev script exists')
} else {
  console.log('   ❌ Dev script not found')
  allGood = false
}

// Summary
console.log('\n' + '='.repeat(50))
if (allGood) {
  console.log('\n✅ ALL CHECKS PASSED!\n')
  console.log('Your furniture estimator is ready to run.')
  console.log('\nNext steps:')
  console.log('1. Start the dev server: npm run dev')
  console.log('2. Open http://localhost:3000')
  console.log('3. Test the application flow')
  console.log('\nQuick test pages:')
  console.log('- Home: http://localhost:3000')
  console.log('- Customize: http://localhost:3000/customize')
  console.log('- Listings: http://localhost:3000/listings')
  console.log('- Admin: http://localhost:3000/admin')
} else {
  console.log('\n❌ SOME CHECKS FAILED\n')
  console.log('Please fix the issues above before running the application.')
}

console.log('\n' + '='.repeat(50))
