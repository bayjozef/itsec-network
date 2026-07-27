CREATE OR REPLACE FUNCTION is_mod()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mod')
$$ LANGUAGE sql SECURITY DEFINER;

-- Products policies for mod
CREATE POLICY "products_insert_mod" ON products FOR INSERT TO authenticated WITH CHECK (is_mod());
CREATE POLICY "products_update_mod" ON products FOR UPDATE TO authenticated USING (is_mod());

-- Categories policies for mod
CREATE POLICY "categories_insert_mod" ON categories FOR INSERT TO authenticated WITH CHECK (is_mod());
CREATE POLICY "categories_update_mod" ON categories FOR UPDATE TO authenticated USING (is_mod());
