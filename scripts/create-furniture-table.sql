-- Create furniture table for ready-made items
CREATE TABLE IF NOT EXISTS public.furniture (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    material VARCHAR(100) NOT NULL,
    dimensions JSONB NOT NULL,
    finish VARCHAR(100) NOT NULL,
    color VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL,
    stock INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    images TEXT[] DEFAULT '{}',
    description TEXT,
    model3d JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample furniture
INSERT INTO public.furniture (name, category, material, dimensions, finish, color, price, stock, images, description, model3d) VALUES
('Modern Oak Dining Table', 'table', 'oak', '{"width": 72, "height": 30, "depth": 36}', 'stained', 'brown', 45000, 5, 
 ARRAY['/placeholder.svg?height=300&width=400&text=Oak+Table'], 
 'Beautiful handcrafted oak dining table perfect for family gatherings.',
 '{"glb": "/assets/3d/duck.glb"}'),
('Teak Wood Bookshelf', 'bookshelf', 'teak', '{"width": 36, "height": 72, "depth": 12}', 'natural', 'natural', 32000, 8,
 ARRAY['/placeholder.svg?height=300&width=400&text=Teak+Bookshelf'],
 'Elegant teak bookshelf with multiple compartments.',
 '{"glb": "/assets/3d/duck.glb"}'),
('Mahogany Executive Chair', 'chair', 'mahogany', '{"width": 24, "height": 42, "depth": 24}', 'lacquered', 'cherry', 28000, 12,
 ARRAY['/placeholder.svg?height=300&width=400&text=Mahogany+Chair'],
 'Luxurious mahogany executive chair with premium upholstery.',
 '{"glb": "/assets/3d/duck.glb"}');
