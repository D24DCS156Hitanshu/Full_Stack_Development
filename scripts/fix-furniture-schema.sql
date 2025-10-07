-- Drop and recreate the furniture table with correct JSONB types
DROP TABLE IF EXISTS public.furniture CASCADE;

CREATE TABLE public.furniture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  material VARCHAR(100) NOT NULL,
  dimensions JSONB NOT NULL DEFAULT '{"width": 0, "height": 0, "depth": 0}'::jsonb,
  finish VARCHAR(100),
  color VARCHAR(100),
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active',
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT,
  model3d JSONB DEFAULT '{"glb": null, "usdz": null}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_furniture_category ON public.furniture(category);
CREATE INDEX idx_furniture_status ON public.furniture(status);
CREATE INDEX idx_furniture_created_at ON public.furniture(created_at DESC);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_furniture_updated_at
  BEFORE UPDATE ON public.furniture
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data with proper JSONB structure
INSERT INTO public.furniture (name, category, material, dimensions, finish, color, price, stock, description, model3d, images) VALUES
(
  'Modern Oak Sofa',
  'sofa',
  'oak',
  '{"width": 84, "height": 36, "depth": 38}'::jsonb,
  'natural',
  'natural',
  45000,
  5,
  'A beautiful modern oak sofa with comfortable cushions',
  '{"glb": "https://modelviewer.dev/shared-assets/models/Astronaut.glb", "usdz": null}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800']
),
(
  'Teak Dining Table',
  'table',
  'teak',
  '{"width": 72, "height": 30, "depth": 42}'::jsonb,
  'stained',
  'brown',
  35000,
  3,
  'Elegant teak dining table perfect for family gatherings',
  '{"glb": "https://modelviewer.dev/shared-assets/models/Astronaut.glb", "usdz": null}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800']
);

-- Create storage bucket for furniture models
INSERT INTO storage.buckets (id, name, public) 
VALUES ('furniture-models', 'furniture-models', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies for furniture models bucket
CREATE POLICY "Anyone can view furniture models"
ON storage.objects FOR SELECT
USING (bucket_id = 'furniture-models');

CREATE POLICY "Authenticated users can upload furniture models"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'furniture-models'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update their furniture models"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'furniture-models'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete furniture models"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'furniture-models'
  AND auth.role() = 'authenticated'
);

-- Create storage bucket for furniture images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('furniture-images', 'furniture-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for furniture images bucket
CREATE POLICY "Anyone can view furniture images"
ON storage.objects FOR SELECT
USING (bucket_id = 'furniture-images');

CREATE POLICY "Authenticated users can upload furniture images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'furniture-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update their furniture images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'furniture-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete furniture images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'furniture-images'
  AND auth.role() = 'authenticated'
);
