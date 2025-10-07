import fs from 'fs'
import path from 'path'

const DB_DIR = path.join(process.cwd(), 'data')
const FURNITURE_FILE = path.join(DB_DIR, 'furniture.json')

export interface FurnitureItem {
  id: string
  name: string
  category: string
  material: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  finish: string
  color: string
  price: number
  stock: number
  status: string
  images: string[]
  description: string
  model3d?: {
    glb?: string
    usdz?: string
  }
  created_at: string
  updated_at: string
}

function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
}

function readFurniture(): FurnitureItem[] {
  ensureDbDir()
  if (!fs.existsSync(FURNITURE_FILE)) {
    fs.writeFileSync(FURNITURE_FILE, JSON.stringify([]))
    return []
  }
  const data = fs.readFileSync(FURNITURE_FILE, 'utf-8')
  return JSON.parse(data)
}

function writeFurniture(data: FurnitureItem[]) {
  ensureDbDir()
  fs.writeFileSync(FURNITURE_FILE, JSON.stringify(data, null, 2))
}

export const db = {
  furniture: {
    findAll: () => readFurniture(),
    findById: (id: string) => readFurniture().find(item => item.id === id),
    create: (item: FurnitureItem) => {
      const items = readFurniture()
      items.push(item)
      writeFurniture(items)
      return item
    },
    update: (id: string, updates: Partial<FurnitureItem>) => {
      const items = readFurniture()
      const index = items.findIndex(item => item.id === id)
      if (index === -1) return null
      items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() }
      writeFurniture(items)
      return items[index]
    },
    delete: (id: string) => {
      const items = readFurniture()
      const filtered = items.filter(item => item.id !== id)
      writeFurniture(filtered)
      return filtered.length < items.length
    }
  }
}
