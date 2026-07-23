-- ─── Banners ──────────────────────────────────────────────────────────────────
INSERT INTO banners (title, subtitle, image_url, link_url, is_active, sort_order) VALUES
  ('Hikvision AcuSense 4MP',
   'Ağıllı insan/nəqliyyat tanıma — 40% endirim',
   'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&q=80',
   '/products?brand=hikvision',
   true, 1),
  ('ColorVu Rəngli Gecə Görüntüsü',
   '0 lüks şəraitdə tam rəngli video',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
   '/products?category=outdoor-cameras',
   true, 2),
  ('Topdancı qiymətləri',
   'Diler olun — 15% daimi endirim qazanın',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
   '/user/dealer',
   true, 3)
ON CONFLICT DO NOTHING;

-- ─── Site Settings ─────────────────────────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
  ('site_name',        '"ITSecurity.az"'),
  ('site_phone',       '"+994 50 000 00 00"'),
  ('site_email',       '"info@itsecurity.az"'),
  ('site_address',     '"Bakı, Azərbaycan"'),
  ('whatsapp_number',  '"+994500000000"'),
  ('currency',         '"AZN"'),
  ('currency_symbol',  '"₼"')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;