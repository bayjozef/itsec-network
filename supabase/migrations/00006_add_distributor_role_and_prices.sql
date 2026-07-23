-- Allow 'distributor' role in profiles CHECK constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'dealer', 'distributor', 'admin'));

-- Add distributor price tier (10% off = diler/reseller) and cost price (admin view)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS distributor_price numeric(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS cost_price        numeric(10,2) DEFAULT NULL;

-- Auto-populate: distributor_price = price * 0.90, cost_price = price * 0.80 for existing rows
UPDATE products
  SET distributor_price = ROUND(price * 0.90, 2),
      cost_price        = ROUND(price * 0.75, 2)
  WHERE distributor_price IS NULL;