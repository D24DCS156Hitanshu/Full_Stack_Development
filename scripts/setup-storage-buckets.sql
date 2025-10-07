-- Create storage buckets for furniture models and images
-- This script ensures the buckets exist and are properly configured

-- Create furniture-models bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('furniture-models', 'furniture-models', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create furniture-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('furniture-images', 'furniture-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Set up storage policies for furniture-models bucket
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Public Access for furniture-models"
ON storage.objects FOR SELECT
USING (bucket_id = 'furniture-models');

-- Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload furniture-models"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'furniture-models' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can update furniture-models"
ON storage.objects FOR UPDATE
USING (bucket_id = 'furniture-models' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can delete furniture-models"
ON storage.objects FOR DELETE
USING (bucket_id = 'furniture-models' AND auth.role() = 'authenticated');

-- Set up storage policies for furniture-images bucket
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Public Access for furniture-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'furniture-images');

-- Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload furniture-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'furniture-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can update furniture-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'furniture-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can delete furniture-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'furniture-images' AND auth.role() = 'authenticated');

-- Verify buckets were created
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id IN ('furniture-models', 'furniture-images');
