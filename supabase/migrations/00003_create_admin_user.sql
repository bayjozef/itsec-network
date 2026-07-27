
-- Insert admin user profile (will be linked to auth user after creation)
-- This function creates admin via direct SQL
CREATE OR REPLACE FUNCTION create_admin_profile(admin_email text, admin_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (admin_id, admin_email, 'Administrator', 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
