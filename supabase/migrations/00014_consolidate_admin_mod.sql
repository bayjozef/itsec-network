CREATE OR REPLACE FUNCTION public.is_admin_or_mod()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'mod'))
$function$;

-- Products
DROP POLICY IF EXISTS "products_insert_admin" ON products;
DROP POLICY IF EXISTS "products_update_admin" ON products;
DROP POLICY IF EXISTS "products_insert_mod" ON products;
DROP POLICY IF EXISTS "products_update_mod" ON products;

CREATE POLICY "products_insert_admin_mod" ON products FOR INSERT TO public WITH CHECK (is_admin_or_mod());
CREATE POLICY "products_update_admin_mod" ON products FOR UPDATE TO public USING (is_admin_or_mod());

-- Categories
DROP POLICY IF EXISTS "categories_insert_admin" ON categories;
DROP POLICY IF EXISTS "categories_update_admin" ON categories;
DROP POLICY IF EXISTS "categories_insert_mod" ON categories;
DROP POLICY IF EXISTS "categories_update_mod" ON categories;

CREATE POLICY "categories_insert_admin_mod" ON categories FOR INSERT TO public WITH CHECK (is_admin_or_mod());
CREATE POLICY "categories_update_admin_mod" ON categories FOR UPDATE TO public USING (is_admin_or_mod());

-- Brands
DROP POLICY IF EXISTS "brands_insert_admin" ON brands;
DROP POLICY IF EXISTS "brands_update_admin" ON brands;

CREATE POLICY "brands_insert_admin_mod" ON brands FOR INSERT TO public WITH CHECK (is_admin_or_mod());
CREATE POLICY "brands_update_admin_mod" ON brands FOR UPDATE TO public USING (is_admin_or_mod());
