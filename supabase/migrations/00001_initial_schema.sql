
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'dealer', 'admin')),
  dealer_status text DEFAULT 'none' CHECK (dealer_status IN ('none', 'pending', 'approved', 'rejected')),
  credit_limit numeric DEFAULT 0,
  credit_used numeric DEFAULT 0,
  address text,
  city text,
  country text DEFAULT 'Azerbaijan',
  avatar_url text,
  language text DEFAULT 'en' CHECK (language IN ('en', 'az', 'ru')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_az text,
  name_ru text,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  parent_id uuid REFERENCES categories(id),
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Brands table
CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  description text,
  website_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_az text,
  name_ru text,
  slug text UNIQUE NOT NULL,
  sku text UNIQUE,
  description text,
  description_az text,
  description_ru text,
  category_id uuid REFERENCES categories(id),
  brand_id uuid REFERENCES brands(id),
  price numeric NOT NULL DEFAULT 0,
  dealer_price numeric,
  stock_qty integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  thumbnail_url text,
  specifications jsonb DEFAULT '{}',
  tags text[],
  weight_kg numeric,
  warranty_months integer DEFAULT 12,
  model_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product images
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false
);

-- Sliders / Banners (CMS)
CREATE TABLE banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  link_url text,
  button_text text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Blog posts
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  title_az text,
  title_ru text,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  thumbnail_url text,
  author_id uuid REFERENCES profiles(id),
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart items
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Wishlist items
CREATE TABLE wishlist_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES profiles(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  is_dealer_order boolean DEFAULT false,
  subtotal numeric NOT NULL DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  shipping_city text,
  shipping_country text DEFAULT 'Azerbaijan',
  notes text,
  invoice_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_sku text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL
);

-- Quote requests
CREATE TABLE quote_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending','reviewed','quoted','accepted','rejected')),
  message text NOT NULL,
  quoted_amount numeric,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quote request items
CREATE TABLE quote_request_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id uuid NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  notes text
);

-- Messages
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  admin_id uuid REFERENCES profiles(id),
  subject text NOT NULL,
  content text NOT NULL,
  is_from_admin boolean DEFAULT false,
  is_read boolean DEFAULT false,
  parent_id uuid REFERENCES messages(id),
  created_at timestamptz DEFAULT now()
);

-- Reviews (product reviews)
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Site settings (CMS)
CREATE TABLE site_settings (
  key text PRIMARY KEY,
  value text,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'PSC-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 99999)::text, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
EXECUTE FUNCTION generate_order_number();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('products', 'products', true),
  ('avatars', 'avatars', true),
  ('banners', 'banners', true),
  ('documents', 'documents', false);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Helper: is_admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper: is_dealer
CREATE OR REPLACE FUNCTION is_dealer()
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'dealer' AND dealer_status = 'approved')
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS POLICIES

-- profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "profiles_delete_admin" ON profiles FOR DELETE USING (is_admin());

-- categories (public read)
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_admin" ON categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "categories_update_admin" ON categories FOR UPDATE USING (is_admin());
CREATE POLICY "categories_delete_admin" ON categories FOR DELETE USING (is_admin());

-- brands (public read)
CREATE POLICY "brands_select_all" ON brands FOR SELECT USING (true);
CREATE POLICY "brands_insert_admin" ON brands FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "brands_update_admin" ON brands FOR UPDATE USING (is_admin());
CREATE POLICY "brands_delete_admin" ON brands FOR DELETE USING (is_admin());

-- products (public read)
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_admin" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "products_update_admin" ON products FOR UPDATE USING (is_admin());
CREATE POLICY "products_delete_admin" ON products FOR DELETE USING (is_admin());

-- product_images (public read)
CREATE POLICY "product_images_select_all" ON product_images FOR SELECT USING (true);
CREATE POLICY "product_images_insert_admin" ON product_images FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "product_images_update_admin" ON product_images FOR UPDATE USING (is_admin());
CREATE POLICY "product_images_delete_admin" ON product_images FOR DELETE USING (is_admin());

-- banners (public read)
CREATE POLICY "banners_select_all" ON banners FOR SELECT USING (true);
CREATE POLICY "banners_insert_admin" ON banners FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "banners_update_admin" ON banners FOR UPDATE USING (is_admin());
CREATE POLICY "banners_delete_admin" ON banners FOR DELETE USING (is_admin());

-- blog_posts (public read published)
CREATE POLICY "blog_posts_select_published" ON blog_posts FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "blog_posts_insert_admin" ON blog_posts FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "blog_posts_update_admin" ON blog_posts FOR UPDATE USING (is_admin());
CREATE POLICY "blog_posts_delete_admin" ON blog_posts FOR DELETE USING (is_admin());

-- cart_items
CREATE POLICY "cart_select_own" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cart_insert_own" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_update_own" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cart_delete_own" ON cart_items FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- wishlist_items
CREATE POLICY "wishlist_select_own" ON wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert_own" ON wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_delete_own" ON wishlist_items FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "wishlist_update_own" ON wishlist_items FOR UPDATE USING (auth.uid() = user_id);

-- orders
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "orders_delete_admin" ON orders FOR DELETE USING (is_admin());

-- order_items
CREATE POLICY "order_items_select_own" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "order_items_insert_own" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "order_items_update_admin" ON order_items FOR UPDATE USING (is_admin());
CREATE POLICY "order_items_delete_admin" ON order_items FOR DELETE USING (is_admin());

-- quote_requests
CREATE POLICY "quotes_select_own" ON quote_requests FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "quotes_insert_own" ON quote_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quotes_update_admin" ON quote_requests FOR UPDATE USING (is_admin());
CREATE POLICY "quotes_delete_admin" ON quote_requests FOR DELETE USING (is_admin());

-- quote_request_items
CREATE POLICY "quote_items_select_own" ON quote_request_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM quote_requests WHERE quote_requests.id = quote_id AND (quote_requests.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "quote_items_insert_own" ON quote_request_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM quote_requests WHERE quote_requests.id = quote_id AND quote_requests.user_id = auth.uid())
);
CREATE POLICY "quote_items_update_admin" ON quote_request_items FOR UPDATE USING (is_admin());
CREATE POLICY "quote_items_delete_admin" ON quote_request_items FOR DELETE USING (is_admin());

-- messages
CREATE POLICY "messages_select_own" ON messages FOR SELECT USING (auth.uid() = user_id OR auth.uid() = admin_id OR is_admin());
CREATE POLICY "messages_insert_own" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "messages_update_admin" ON messages FOR UPDATE USING (is_admin() OR auth.uid() = user_id);
CREATE POLICY "messages_delete_admin" ON messages FOR DELETE USING (is_admin());

-- reviews
CREATE POLICY "reviews_select_approved" ON reviews FOR SELECT USING (is_approved = true OR auth.uid() = user_id OR is_admin());
CREATE POLICY "reviews_insert_auth" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_admin" ON reviews FOR UPDATE USING (is_admin());
CREATE POLICY "reviews_delete_admin" ON reviews FOR DELETE USING (is_admin());

-- site_settings
CREATE POLICY "settings_select_all" ON site_settings FOR SELECT USING (true);
CREATE POLICY "settings_insert_admin" ON site_settings FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "settings_update_admin" ON site_settings FOR UPDATE USING (is_admin());
CREATE POLICY "settings_delete_admin" ON site_settings FOR DELETE USING (is_admin());

-- Storage policies
CREATE POLICY "products_storage_public" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "products_storage_admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND is_admin());
CREATE POLICY "avatars_storage_own" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_upload_own" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "banners_storage_public" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "banners_storage_admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND is_admin());
