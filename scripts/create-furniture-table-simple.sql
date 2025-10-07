-- Create furniture table
CREATE TABLE IF NOT EXISTS public.furniture (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    material VARCHAR(100),
    dimensions VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample furniture data
INSERT INTO public.furniture (name, category, material, dimensions, price, stock, description, image_url) VALUES
('Modern Sofa', 'Living Room', 'Fabric', '84" W x 36" D x 32" H', 1299.99, 5, 'Comfortable modern sofa with clean lines', '/placeholder.svg?height=300&width=400'),
('Oak Dining Table', 'Dining Room', 'Oak Wood', '72" W x 36" D x 30" H', 899.99, 3, 'Solid oak dining table for 6 people', '/placeholder.svg?height=300&width=400'),
('Leather Armchair', 'Living Room', 'Leather', '32" W x 34" D x 36" H', 699.99, 8, 'Premium leather armchair with wooden legs', '/placeholder.svg?height=300&width=400'),
('Queen Bed Frame', 'Bedroom', 'Pine Wood', '64" W x 84" D x 48" H', 549.99, 4, 'Minimalist queen size bed frame', '/placeholder.svg?height=300&width=400'),
('Coffee Table', 'Living Room', 'Glass/Metal', '48" W x 24" D x 18" H', 299.99, 12, 'Modern glass top coffee table with metal legs', '/placeholder.svg?height=300&width=400'),
('Bookshelf', 'Office', 'Walnut Wood', '36" W x 12" D x 72" H', 399.99, 6, '5-tier walnut bookshelf for home office', '/placeholder.svg?height=300&width=400');
