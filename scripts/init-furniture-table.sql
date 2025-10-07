-- Drop existing furniture table if it exists to start fresh
DROP TABLE IF EXISTS public.furniture CASCADE;

-- Updated model3d to JSONB and dimensions to JSONB to match application expectations
CREATE TABLE public.furniture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    material VARCHAR(100),
    dimensions JSONB,
    finish VARCHAR(100),
    color VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    images TEXT[] DEFAULT '{}',
    description TEXT,
    model3d JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_furniture_status ON public.furniture(status);
CREATE INDEX idx_furniture_category ON public.furniture(category);
CREATE INDEX idx_furniture_created_at ON public.furniture(created_at);

-- Updated sample data to use proper JSONB format for dimensions and model3d
INSERT INTO public.furniture (name, category, material, dimensions, finish, color, price, stock, status, images, description, model3d) VALUES
('Modern Sofa', 'Living Room', 'Fabric', '{"width": 84, "height": 36, "depth": 32}'::jsonb, 'Matte', 'Gray', 1299.99, 5, 'Active', ARRAY['/placeholder.svg?height=300&width=400'], 'Comfortable modern sofa with clean lines and contemporary design', '{"glb": "/assets/3d/sofa.glb", "usdz": "/assets/3d/sofa.usdz"}'::jsonb),
('Oak Dining Table', 'Dining Room', 'Oak Wood', '{"width": 72, "height": 36, "depth": 30}'::jsonb, 'Natural', 'Oak', 899.99, 3, 'Active', ARRAY['/placeholder.svg?height=300&width=400'], 'Solid oak dining table that seats 6 people comfortably', '{"glb": "/assets/3d/table.glb"}'::jsonb),
('Leather Armchair', 'Living Room', 'Leather', '{"width": 32, "height": 34, "depth": 36}'::jsonb, 'Glossy', 'Brown', 699.99, 8, 'Active', ARRAY['/placeholder.svg?height=300&width=400'], 'Premium leather armchair with solid wooden legs', '{"glb": "/assets/3d/chair.glb"}'::jsonb),
('Queen Bed Frame', 'Bedroom', 'Pine Wood', '{"width": 64, "height": 84, "depth": 48}'::jsonb, 'Natural', 'Pine', 549.99, 4, 'Active', ARRAY['/placeholder.svg?height=300&width=400'], 'Minimalist queen size bed frame with clean lines', '{"glb": "/assets/3d/bed.glb"}'::jsonb),
('Coffee Table', 'Living Room', 'Glass/Metal', '{"width": 48, "height": 24, "depth": 18}'::jsonb, 'Polished', 'Clear', 299.99, 12, 'Active', ARRAY['/placeholder.svg?height=300&width=400'], 'Modern glass top coffee table with sleek metal legs', '{"glb": "/assets/3d/coffee-table.glb"}'::jsonb),
('Bookshelf', 'Office', 'Walnut Wood', '{"width": 36, "height": 12, "depth": 72}'::jsonb, 'Natural', 'Walnut', 399.99, 6, 'Active', ARRAY['/placeholder.svg?height=300&width=400'], '5-tier walnut bookshelf perfect for home office organization', '{"glb": "/assets/3d/bookshelf.glb"}'::jsonb);
