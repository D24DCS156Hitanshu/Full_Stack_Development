const fs = require('fs')
const path = require('path')
const { randomUUID } = require('crypto')

const DB_DIR = path.join(__dirname, 'data')
const FURNITURE_FILE = path.join(DB_DIR, 'furniture.json')

console.log('=== Adding Sample Furniture Data ===\n')

const sampleFurniture = [
  {
    id: randomUUID(),
    name: 'Classic Oak Dining Table',
    category: 'table',
    material: 'oak',
    dimensions: { width: 72, height: 30, depth: 36 },
    finish: 'natural',
    color: 'natural',
    price: 45000,
    stock: 8,
    status: 'Active',
    images: ['/placeholder.svg?height=300&width=400&text=Oak+Table'],
    description: 'A beautiful handcrafted oak dining table perfect for family gatherings. Features solid oak construction with natural finish.',
    model3d: { glb: '/placeholder-model.glb' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'Modern Walnut Chair',
    category: 'chair',
    material: 'walnut',
    dimensions: { width: 24, height: 36, depth: 24 },
    finish: 'stained',
    color: 'brown',
    price: 18000,
    stock: 15,
    status: 'Active',
    images: ['/placeholder.svg?height=300&width=400&text=Walnut+Chair'],
    description: 'Ergonomic walnut chair with rich brown stain. Comfortable seating with elegant design.',
    model3d: { glb: '/placeholder-model.glb' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'Luxury Teak Sofa',
    category: 'sofa',
    material: 'teak',
    dimensions: { width: 84, height: 36, depth: 36 },
    finish: 'lacquered',
    color: 'natural',
    price: 125000,
    stock: 5,
    status: 'Active',
    images: ['/placeholder.svg?height=300&width=400&text=Teak+Sofa'],
    description: 'Premium teak wood sofa with lacquered finish. Three-seater design with plush cushions.',
    model3d: { glb: '/placeholder-model.glb' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'Pine Wood Bookshelf',
    category: 'bookshelf',
    material: 'pine',
    dimensions: { width: 48, height: 72, depth: 12 },
    finish: 'painted',
    color: 'white',
    price: 28000,
    stock: 12,
    status: 'Active',
    images: ['/placeholder.svg?height=300&width=400&text=Pine+Bookshelf'],
    description: 'Spacious pine bookshelf with white painted finish. Five shelves for books and decorations.',
    model3d: { glb: '/placeholder-model.glb' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'Mahogany King Bed',
    category: 'bed',
    material: 'mahogany',
    dimensions: { width: 76, height: 48, depth: 80 },
    finish: 'stained',
    color: 'cherry',
    price: 95000,
    stock: 6,
    status: 'Active',
    images: ['/placeholder.svg?height=300&width=400&text=Mahogany+Bed'],
    description: 'Elegant mahogany king-size bed with cherry stain. Includes headboard and footboard.',
    model3d: { glb: '/placeholder-model.glb' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'Maple Wood Dresser',
    category: 'dresser',
    material: 'maple',
    dimensions: { width: 60, height: 36, depth: 20 },
    finish: 'natural',
    color: 'natural',
    price: 52000,
    stock: 7,
    status: 'Active',
    images: ['/placeholder.svg?height=300&width=400&text=Maple+Dresser'],
    description: 'Six-drawer maple dresser with natural finish. Smooth gliding drawers with quality hardware.',
    model3d: { glb: '/placeholder-model.glb' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Read existing data
let existingData = []
if (fs.existsSync(FURNITURE_FILE)) {
  existingData = JSON.parse(fs.readFileSync(FURNITURE_FILE, 'utf-8'))
}

console.log('Current furniture count:', existingData.length)

// Add sample data
const updatedData = [...existingData, ...sampleFurniture]
fs.writeFileSync(FURNITURE_FILE, JSON.stringify(updatedData, null, 2))

console.log('Added', sampleFurniture.length, 'sample furniture items')
console.log('New furniture count:', updatedData.length)
console.log('\n✓ Sample data added successfully!\n')

console.log('Sample furniture added:')
sampleFurniture.forEach((item, index) => {
  console.log(`${index + 1}. ${item.name} - ₹${item.price.toLocaleString()}`)
})

console.log('\nYou can now:')
console.log('1. Start the dev server: npm run dev')
console.log('2. Visit http://localhost:3000/listings to see the furniture')
console.log('3. Visit http://localhost:3000/admin to manage furniture')
