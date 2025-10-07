-- Update user profiles table to include email validation info
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email_type VARCHAR(20) DEFAULT 'gmail',
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS institution_name TEXT;

-- Create function to validate email domains
CREATE OR REPLACE FUNCTION validate_email_domain(email TEXT)
RETURNS TABLE(is_valid BOOLEAN, email_type TEXT, institution TEXT) AS $$
BEGIN
  -- Extract domain from email
  DECLARE
    domain TEXT := LOWER(SPLIT_PART(email, '@', 2));
  BEGIN
    -- Check for Gmail
    IF domain = 'gmail.com' THEN
      RETURN QUERY SELECT true, 'gmail'::TEXT, 'Google'::TEXT;
    END IF;
    
    -- Check for educational domains
    IF domain LIKE '%.edu' OR 
       domain LIKE '%.edu.%' OR 
       domain LIKE '%.ac.%' OR
       domain IN (
         'harvard.edu', 'mit.edu', 'stanford.edu', 'berkeley.edu', 'caltech.edu',
         'princeton.edu', 'yale.edu', 'columbia.edu', 'uchicago.edu', 'upenn.edu',
         'iit.ac.in', 'iisc.ac.in', 'nit.ac.in', 'bits-pilani.ac.in', 'du.ac.in',
         'ox.ac.uk', 'cam.ac.uk', 'imperial.ac.uk', 'ucl.ac.uk', 'kcl.ac.uk',
         'utoronto.ca', 'ubc.ca', 'mcgill.ca', 'uwaterloo.ca', 'queensu.ca',
         'nus.edu.sg', 'ntu.edu.sg', 'hku.hk', 'cuhk.edu.hk', 'ust.hk'
       ) THEN
      RETURN QUERY SELECT true, 'educational'::TEXT, domain::TEXT;
    END IF;
    
    -- Invalid domain
    RETURN QUERY SELECT false, 'invalid'::TEXT, ''::TEXT;
  END;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate emails on user creation
CREATE OR REPLACE FUNCTION validate_user_email()
RETURNS TRIGGER AS $$
DECLARE
  validation_result RECORD;
BEGIN
  -- Validate email domain
  SELECT * INTO validation_result FROM validate_email_domain(NEW.email);
  
  IF NOT validation_result.is_valid THEN
    RAISE EXCEPTION 'Only Gmail and educational institution emails are allowed. Email: %', NEW.email;
  END IF;
  
  -- Update user metadata with email type
  NEW.raw_user_meta_data = COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'email_type', validation_result.email_type,
      'institution', validation_result.institution
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to auth.users table (if accessible)
-- Note: This might need to be done at the Supabase project level
-- CREATE TRIGGER validate_email_trigger
--   BEFORE INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION validate_user_email();

-- Create policy for furniture estimates based on email validation
CREATE POLICY "Only verified users can create estimates" ON furniture_estimates
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND email_type IN ('gmail', 'educational')
    )
  );

-- Update existing policy
DROP POLICY IF EXISTS "Users can view and manage own estimates" ON furniture_estimates;
CREATE POLICY "Users can view and manage own estimates" ON furniture_estimates
  FOR ALL USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND email_type IN ('gmail', 'educational')
    )
  );
