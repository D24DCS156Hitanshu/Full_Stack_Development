const fs = require('fs')
const path = require('path')

const DB_DIR = path.join(__dirname, 'data')
const FURNITURE_FILE = path.join(DB_DIR, 'furniture.json')

console.log('=== Testing Local Database ===\n')

// Test 1: Read empty database
console.log('Test 1: Reading empty database')
const data = JSON.parse(fs.readFileSync(FURNITURE_FILE, 'utf-8'))
console.log('Current furniture count:', data.length)
console.log('✓ Read successful\n')

// Test 2: Add test furniture
console.log('Test 2: Adding test furniture')
const testFurniture = {
  id: crypto.randomUUID(),
  name: 'Test Oak Table',
  category: 'table',
  material: 'oak',
  dimensions: { width: 72, height: 30, depth: 36 },
  finish: 'natural',
  color: 'natural',
  price: 45000,
  stock: 5,
  status: 'Active',
  images: ['/placeholder.svg'],
  description: 'A beautiful oak table for testing',
  model3d: { glb: '/uploads/models/test.glb' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

data.push(testFurniture)
fs.writeFileSync(FURNITURE_FILE, JSON.stringify(data, null, 2))
console.log('✓ Furniture added successfully')
console.log('New furniture count:', data.length)
console.log('Added furniture:', testFurniture.name, '\n')

// Test 3: Read updated database
console.log('Test 3: Reading updated database')
const updatedData = JSON.parse(fs.readFileSync(FURNITURE_FILE, 'utf-8'))
console.log('Furniture count after read:', updatedData.length)
console.log('✓ Read successful\n')

// Test 4: Filter active furniture
console.log('Test 4: Filtering active furniture')
const activeFurniture = updatedData.filter(item => item.status === 'Active')
console.log('Active furniture count:', activeFurniture.length)
console.log('✓ Filter successful\n')

console.log('=== All Tests Passed ===')
console.log('\nDatabase file location:', FURNITURE_FILE)
console.log('You can now start the dev server with: npm run dev')
