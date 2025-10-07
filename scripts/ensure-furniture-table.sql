-- Ensure furniture table exists with correct structure and permissions
-- Drop and recreate the furniture table to ensure it has the correct structure
DROP TABLE IF EXISTS furniture;

-- Create furniture table with all required columns
CREATE TABLE furniture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    material TEXT NOT NULL,
    dimensions JSONB NOT NULL DEFAULT '{"width": 0, "height": 0, "depth": 0}',
    finish TEXT NOT NULL,
    color TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active',
    images TEXT[] DEFAULT '{}',
    description TEXT DEFAULT '',
    model3d JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE furniture ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for testing)
CREATE POLICY "Allow all operations on furniture" ON furniture
    FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample data for testing
INSERT INTO furniture (name, category, material, dimensions, finish, color, price, stock, status, images, description) VALUES
('Sample Oak Table', 'Table', 'Oak', '{"width": 48, "height": 30, "depth": 24}', 'Stained', 'Brown', 25000, 5, 'Active', '{}', 'Beautiful handcrafted oak table'),
('Modern Pine Chair', 'Chair', 'Pine', '{"width": 18, "height": 36, "depth": 20}', 'Natural', 'Light Brown', 8000, 10, 'Active', '{}', 'Comfortable modern pine chair');

-- Verify the table was created successfully
SELECT 'Furniture table created successfully' as status;
SELECT COUNT(*) as furniture_count FROM furniture;
