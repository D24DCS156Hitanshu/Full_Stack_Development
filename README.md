# Woodora - Furniture Estimator

A full-stack furniture price estimation and customization platform with AR/VR preview capabilities.

## 🚀 Changes Made - Local File Database

This project has been converted from Supabase to use **local JSON file storage**. All data is now stored locally in the `data/` directory.

### Key Changes:

1. **Database System**: Replaced Supabase with local JSON file storage
   - Database file: `data/furniture.json`
   - Database utilities: `lib/db.ts`

2. **File Storage**: Replaced Supabase Storage with local file uploads
   - Upload directory: `public/uploads/`
   - Models stored in: `public/uploads/models/`
   - Images stored in: `public/uploads/images/`
   - Storage utilities: `lib/storage.ts`

3. **API Routes Updated**:
   - `app/api/furniture/route.ts` - GET and POST furniture
   - `app/api/furniture/[id]/route.ts` - DELETE furniture
   - `app/api/upload/route.ts` - File upload handler (NEW)

4. **Components Updated**:
   - `components/admin/add-furniture-modal.tsx` - Uses local storage
   - All Supabase references removed

## 📁 Project Structure

```
furniture-estimator/
├── app/
│   ├── api/
│   │   ├── furniture/
│   │   │   ├── route.ts          # GET/POST furniture
│   │   │   └── [id]/route.ts     # DELETE furniture
│   │   └── upload/
│   │       └── route.ts          # File upload handler
│   ├── admin/                    # Admin dashboard
│   ├── customize/                # Furniture customization
│   ├── listings/                 # Browse furniture
│   └── page.tsx                  # Home page
├── components/
│   ├── admin/                    # Admin components
│   └── ui/                       # UI components
├── data/
│   └── furniture.json            # Local database
├── lib/
│   ├── db.ts                     # Database utilities
│   └── storage.ts                # File storage utilities
├── public/
│   └── uploads/
│       ├── models/               # 3D model files
│       └── images/               # Product images
└── test-db.js                    # Database test script
```

## 🛠️ Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Verify Database**:
   ```bash
   node test-db.js
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   - Home: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Customize: http://localhost:3000/customize
   - Listings: http://localhost:3000/listings

## 📊 Data Flow

### Adding Furniture (Admin):
1. Admin opens "Add Furniture" modal
2. Uploads 3D models (GLB/USDZ) → Saved to `public/uploads/models/`
3. Uploads images → Saved to `public/uploads/images/`
4. Submits form → POST to `/api/furniture`
5. API saves to `data/furniture.json`
6. Frontend refreshes furniture list

### Viewing Furniture (Customer):
1. Customer visits `/listings`
2. Frontend fetches from `/api/furniture`
3. API reads from `data/furniture.json`
4. Displays furniture with AR/VR preview options

### Customizing Furniture:
1. Customer visits `/customize`
2. Selects options (material, dimensions, finish)
3. Real-time price calculation
4. 3D/AR/VR preview
5. Add to cart or buy now

## 🧪 Testing the Data Flow

### Test 1: Database Operations
```bash
node test-db.js
```
This verifies:
- ✓ Reading from database
- ✓ Writing to database
- ✓ Filtering data
- ✓ Data persistence

### Test 2: Add Furniture via Admin
1. Go to http://localhost:3000/admin
2. Click "Add New Furniture"
3. Fill in details:
   - Name: "Modern Oak Chair"
   - Category: Chair
   - Material: Oak
   - Price: 25000
   - Stock: 10
4. Upload a GLB model file
5. Upload product images
6. Click "Add Furniture"
7. Verify it appears in the admin list

### Test 3: View Furniture in Listings
1. Go to http://localhost:3000/listings
2. Verify the furniture appears
3. Click "Preview" to test AR/VR viewer
4. Click "Add to Cart"

### Test 4: Customize Furniture
1. Go to http://localhost:3000/customize
2. Select category and material
3. Adjust dimensions with sliders
4. Change finish and color
5. Verify price updates in real-time
6. Test 3D/AR/VR preview modes
7. Add to cart

## 🔍 Verifying Data Persistence

Check the database file directly:
```bash
type data\furniture.json
```

Or open `data/furniture.json` in your editor to see all stored furniture items.

## 📝 API Endpoints

### GET /api/furniture
Returns all active furniture items
```json
[
  {
    "id": "uuid",
    "name": "Oak Table",
    "category": "table",
    "material": "oak",
    "dimensions": { "width": 72, "height": 30, "depth": 36 },
    "finish": "natural",
    "color": "natural",
    "price": 45000,
    "stock": 5,
    "status": "Active",
    "images": ["/uploads/images/..."],
    "model3d": { "glb": "/uploads/models/..." }
  }
]
```

### POST /api/furniture
Creates new furniture item
```json
{
  "name": "Modern Chair",
  "category": "chair",
  "material": "oak",
  "dimensions": { "width": 24, "height": 36, "depth": 24 },
  "finish": "stained",
  "color": "brown",
  "price": 25000,
  "stock": 10,
  "description": "A comfortable modern chair",
  "images": ["/uploads/images/..."],
  "model3d": { "glb": "/uploads/models/..." }
}
```

### DELETE /api/furniture/[id]
Deletes furniture by ID

### POST /api/upload
Uploads files (models or images)
```
FormData:
- file: File
- type: "image" | "model"
```

## 🎨 Features

- ✅ Custom furniture price estimation
- ✅ Real-time 3D preview
- ✅ AR viewer for mobile devices
- ✅ VR viewer for immersive experience
- ✅ Admin dashboard for furniture management
- ✅ Shopping cart functionality
- ✅ Responsive design
- ✅ Local file-based database (no external dependencies)

## 🐛 Troubleshooting

### Issue: Furniture not appearing in listings
**Solution**: Check `data/furniture.json` - ensure furniture has `status: "Active"`

### Issue: Upload fails
**Solution**: Verify `public/uploads/models/` and `public/uploads/images/` directories exist

### Issue: Database errors
**Solution**: Run `node test-db.js` to verify database operations

### Issue: Hydration warnings
**Solution**: Already fixed - removed suppressHydrationWarnings from body tag

## 📦 Dependencies

- Next.js 15.2.4
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- Three.js (for 3D rendering)
- React Three Fiber

## 🚀 Production Build

```bash
npm run build
npm start
```

## 📄 License

This project is for educational purposes.

---

**Note**: All data is stored locally. For production use, consider implementing a proper database solution with authentication and authorization.
