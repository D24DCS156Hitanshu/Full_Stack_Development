-- Add missing columns to the furniture table
ALTER TABLE furniture 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS color VARCHAR(100),
ADD COLUMN IF NOT EXISTS finish VARCHAR(100),
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS model3d VARCHAR(500);

-- Update existing records to have Active status
UPDATE furniture SET status = 'Active' WHERE status IS NULL;

-- Add some sample data with the new columns
INSERT INTO furniture (
  name, category, material, dimensions, price, stock, description, image_url,
  status, color, finish, images
) VALUES 
(
  'Modern Oak Dining Table',
  'Tables',
  'Oak Wood',
  '180cm x 90cm x 75cm',
  899.99,
  5,
  'Beautiful modern dining table made from solid oak wood',
  '/placeholder.svg?height=300&width=400',
  'Active',
  'Natural Oak',
  'Matte',
  '[]'::jsonb
),
(
  'Leather Executive Chair',
  'Chairs',
  'Leather',
  '65cm x 70cm x 120cm',
  549.99,
  8,
  'Premium leather executive chair with ergonomic design',
  '/placeholder.svg?height=300&width=400',
  'Active',
  'Black',
  'Glossy',
  '[]'::jsonb
),
(
  'Industrial Bookshelf',
  'Storage',
  'Metal and Wood',
  '80cm x 30cm x 180cm',
  329.99,
  3,
  'Industrial style bookshelf with metal frame and wooden shelves',
  '/placeholder.svg?height=300&width=400',
  'Active',
  'Dark Brown',
  'Rustic',
  '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
