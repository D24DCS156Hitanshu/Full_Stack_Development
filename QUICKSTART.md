# 🚀 Quick Start Guide

## Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

## Step 2: Test Database
```bash
node test-db.js
```
Expected output: All tests passed ✓

## Step 3: Start Server
```bash
npm run dev
```

## Step 4: Test the Application

### A. Test Home Page
1. Open http://localhost:3000
2. Verify page loads without errors
3. Click "Start Customizing" button

### B. Test Customize Page
1. Should be at http://localhost:3000/customize
2. Select "Sofa" from category dropdown
3. Select "Oak Wood" from material dropdown
4. Adjust width slider to 80 inches
5. Select "Stained" finish
6. Select "Rich Brown" color
7. **Verify**: Price updates automatically in right panel
8. Click "Add to Cart" button
9. **Verify**: Success message appears

### C. Test Admin Panel
1. Go to http://localhost:3000/admin
2. Click "Add New Furniture" button
3. Fill in the form:
   - Name: "Test Chair"
   - Category: Chair
   - Material: Oak Wood
   - Finish: Natural
   - Color: Natural Wood
   - Price: 25000
   - Stock: 10
   - Description: "A comfortable test chair"
4. **Note**: For 3D models, you need actual GLB/USDZ files
   - Skip model upload for now (or use placeholder)
5. Upload any image file for product image
6. Click "Add Furniture"
7. **Verify**: Furniture appears in admin list

### D. Test Listings Page
1. Go to http://localhost:3000/listings
2. **Verify**: You see the furniture you just added
3. Click "Preview" button on any furniture
4. **Verify**: Preview modal opens
5. Try switching between AR and VR views
6. Click "Add to Cart"
7. **Verify**: Success message appears

### E. Verify Data Persistence
1. Open `data/furniture.json` in your editor
2. **Verify**: You see the furniture you added
3. Refresh the browser
4. **Verify**: Furniture is still there (data persisted)

## Step 5: Check Console Logs

Open browser DevTools (F12) and check console:
- Should see API request logs
- Should see "✓ Furniture loaded successfully"
- No red errors

## 🎯 Success Criteria

✅ Home page loads without errors
✅ Customize page calculates prices correctly
✅ Admin can add furniture
✅ Furniture appears in listings
✅ Data persists in `data/furniture.json`
✅ File uploads work (images saved to `public/uploads/`)
✅ No hydration errors in console

## 🐛 Common Issues

### Issue: "Cannot find module '@/lib/db'"
**Fix**: Restart the dev server (Ctrl+C, then `npm run dev`)

### Issue: Upload fails
**Fix**: Ensure directories exist:
```bash
mkdir public\uploads\models
mkdir public\uploads\images
```

### Issue: Furniture not showing
**Fix**: Check `data/furniture.json` - ensure status is "Active"

### Issue: Port 3000 already in use
**Fix**: Kill the process or use different port:
```bash
npm run dev -- -p 3001
```

## 📊 Data Flow Verification

```
User Action → Frontend → API Route → Database File → Response → UI Update
```

Example flow for adding furniture:
1. User fills form in admin panel
2. Clicks "Add Furniture"
3. Frontend sends POST to `/api/furniture`
4. API writes to `data/furniture.json`
5. API returns saved furniture
6. Frontend updates furniture list
7. User sees new furniture immediately

## 🎉 You're All Set!

The application is now running with a local file-based database. All data is stored in:
- Database: `data/furniture.json`
- Uploads: `public/uploads/`

No external services required!
