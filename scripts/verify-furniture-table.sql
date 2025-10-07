-- Verify furniture table structure and data
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'furniture' 
ORDER BY ordinal_position;

-- Check if any furniture exists
SELECT COUNT(*) as furniture_count FROM furniture;

-- Show all furniture data
SELECT * FROM furniture ORDER BY created_at DESC LIMIT 10;

-- Check table permissions
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasinserts,
  hasselects,
  hasupdates,
  hasdeletes
FROM pg_tables 
WHERE tablename = 'furniture';
