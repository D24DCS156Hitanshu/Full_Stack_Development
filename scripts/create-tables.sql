-- Create furniture_estimates table
CREATE TABLE IF NOT EXISTS furniture_estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  material VARCHAR(50) NOT NULL,
  dimensions JSONB NOT NULL,
  finish VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_breakdown JSONB NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_furniture_estimates_category ON furniture_estimates(category);
CREATE INDEX IF NOT EXISTS idx_furniture_estimates_created_at ON furniture_estimates(created_at);

-- Create materials table for reference
CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  base_price_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample materials
INSERT INTO materials (name, category, base_price_multiplier, description) VALUES
('Oak Wood', 'wood', 1.20, 'Premium hardwood with excellent durability'),
('Pine Wood', 'wood', 0.80, 'Affordable softwood, great for painted finishes'),
('Mahogany', 'wood', 1.80, 'Luxury hardwood with rich color and grain'),
('Leather', 'upholstery', 2.00, 'Premium leather upholstery'),
('Fabric', 'upholstery', 1.00, 'Standard fabric upholstery'),
('Metal', 'frame', 1.30, 'Durable metal frame construction')
ON CONFLICT DO NOTHING;

-- Create furniture_categories table
CREATE TABLE IF NOT EXISTS furniture_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO furniture_categories (name, base_price, description) VALUES
('sofa', 800.00, 'Comfortable seating for living rooms'),
('chair', 300.00, 'Single seat furniture'),
('table', 500.00, 'Dining and coffee tables'),
('bed', 1200.00, 'Bedroom furniture for sleeping'),
('dresser', 600.00, 'Storage furniture for clothing'),
('bookshelf', 400.00, 'Storage for books and decorative items')
ON CONFLICT DO NOTHING;
