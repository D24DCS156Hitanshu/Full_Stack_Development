const fs = require('fs')
const path = require('path')

const DB_FILE = path.join(__dirname, 'data', 'furniture.json')

const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))

const demoModel = 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb'

data.forEach(item => {
  if (item.model3d && item.model3d.glb === '/placeholder-model.glb') {
    item.model3d.glb = demoModel
  }
})

fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))

console.log('✅ Updated all placeholder models to working demo model')
console.log('Model URL:', demoModel)
