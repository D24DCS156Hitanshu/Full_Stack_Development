-- Update furniture_estimates table to include user_id
ALTER TABLE furniture_estimates 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_furniture_estimates_user_id ON furniture_estimates(user_id);

-- Update materials with wood-specific options
DELETE FROM materials;
INSERT INTO materials (name, category, base_price_multiplier, description) VALUES
('Oak Wood', 'hardwood', 1.20, 'Premium hardwood with excellent durability and beautiful grain'),
('Pine Wood', 'softwood', 0.80, 'Affordable softwood, great for painted finishes'),
('Mahogany', 'hardwood', 1.80, 'Luxury hardwood with rich color and grain'),
('Teak Wood', 'hardwood', 2.20, 'Premium tropical hardwood, highly durable'),
('Walnut Wood', 'hardwood', 1.90, 'Rich, dark hardwood with beautiful grain patterns'),
('Maple Wood', 'hardwood', 1.40, 'Light-colored hardwood with fine, consistent grain')
ON CONFLICT DO NOTHING;

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_profiles
CREATE POLICY "Users can view and update own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- Enable RLS on furniture_estimates
ALTER TABLE furniture_estimates ENABLE ROW LEVEL SECURITY;

-- Create policy for furniture_estimates
CREATE POLICY "Users can view and manage own estimates" ON furniture_estimates
  FOR ALL USING (auth.uid() = user_id);
