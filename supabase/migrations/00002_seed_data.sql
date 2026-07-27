
-- Seed categories
INSERT INTO categories (name, name_az, name_ru, slug, description, image_url, sort_order) VALUES
('IP Cameras', 'IP Kameralar', 'IP-камеры', 'ip-cameras', 'High-resolution IP surveillance cameras', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_c6cf52de-3abb-49ac-9a0e-e4af1d330bb9.jpg', 1),
('Analog Cameras', 'Analog Kameralar', 'Аналоговые камеры', 'analog-cameras', 'Traditional analog CCTV cameras', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1ab2dc14-039d-4d12-b12d-1539abfd6148.jpg', 2),
('DVR / NVR', 'DVR / NVR', 'DVR / NVR', 'dvr-nvr', 'Digital and Network Video Recorders', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_f799327f-f9c1-4297-99e2-4ecb512a0dc1.jpg', 3),
('Switches', 'Switchlər', 'Коммутаторы', 'switches', 'PoE and Managed Network Switches', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_2421ab9d-4022-45f7-8ab4-66af9770682f.jpg', 4),
('Cables & Accessories', 'Kabellər & Aksesuarlar', 'Кабели и аксессуары', 'cables-accessories', 'CCTV cables, connectors and accessories', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e1f32008-b937-46a8-8d41-74a7ec0ac833.jpg', 5),
('Access Control', 'Giriş Nəzarəti', 'Контроль доступа', 'access-control', 'Door locks, readers and access control systems', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1f2e1d83-4c07-4dbd-99d3-89c06ca8dfc9.jpg', 6),
('Alarms', 'Həyəcan Siqnalı', 'Охранная сигнализация', 'alarms', 'Intrusion detection and alarm systems', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_60a74815-14bd-422a-95d7-931373045350.jpg', 7),
('PTZ Cameras', 'PTZ Kameralar', 'PTZ-камеры', 'ptz-cameras', 'Pan-Tilt-Zoom professional cameras', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e3c2448e-f0c4-43ad-abf8-760c0f988077.jpg', 8);

-- Seed brands
INSERT INTO brands (name, slug, description, sort_order) VALUES
('Hikvision', 'hikvision', 'World leading video-centric smart IoT solution provider', 1),
('Dahua', 'dahua', 'Global leading solution provider in the global video-centric smart IoT industry', 2),
('TP-Link', 'tp-link', 'Networking solutions and security cameras', 3),
('Cisco', 'cisco', 'Enterprise networking and security infrastructure', 4),
('Avitel', 'avitel', 'Professional surveillance and security equipment', 5),
('RVI', 'rvi', 'Professional security and surveillance solutions', 6);

-- Seed banners
INSERT INTO banners (title, subtitle, image_url, button_text, link_url, sort_order) VALUES
('Professional Security Portal', 'AI Powered – Fully Operational Web System', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0fc4fcb1-8475-4580-a9bf-d484cc76c4a0.jpg', 'Browse Products', '/products', 1),
('Hikvision Smart Technology Center', 'ColorVu and AcuSense technologies live experience', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_f06aa236-b5fc-4d42-8af8-7425ce2f747f.jpg', 'Learn More', '/products?brand=hikvision', 2),
('Complete Security Solutions', 'DVR, NVR, IP Cameras, Cables and more', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_40cf63ee-f4fd-4fc1-8854-ce02e070946f.jpg', 'Shop Now', '/products', 3);

-- Seed site settings
INSERT INTO site_settings (key, value, description) VALUES
('site_name', 'PROSECURITY.AZ', 'Website name'),
('site_phone', '+994 77 611 77 80', 'Contact phone number'),
('site_address', 'Baku, Azadliq prospekti 143', 'Physical address'),
('site_hours', '09:00 - 18:00 (Mon-Sat)', 'Working hours'),
('site_email', 'info@prosecurity.az', 'Contact email'),
('whatsapp_number', '994776117780', 'WhatsApp number without + sign'),
('dealer_discount_percent', '15', 'Default dealer discount percentage');

-- Seed products (with real images from search)
-- Get category and brand IDs dynamically
DO $$
DECLARE
  cat_ip uuid;
  cat_analog uuid;
  cat_dvr uuid;
  cat_switch uuid;
  cat_access uuid;
  cat_ptz uuid;
  brand_hik uuid;
  brand_dahua uuid;
  brand_tp uuid;
  brand_rvi uuid;
BEGIN
  SELECT id INTO cat_ip FROM categories WHERE slug = 'ip-cameras';
  SELECT id INTO cat_analog FROM categories WHERE slug = 'analog-cameras';
  SELECT id INTO cat_dvr FROM categories WHERE slug = 'dvr-nvr';
  SELECT id INTO cat_switch FROM categories WHERE slug = 'switches';
  SELECT id INTO cat_access FROM categories WHERE slug = 'access-control';
  SELECT id INTO cat_ptz FROM categories WHERE slug = 'ptz-cameras';
  SELECT id INTO brand_hik FROM brands WHERE slug = 'hikvision';
  SELECT id INTO brand_dahua FROM brands WHERE slug = 'dahua';
  SELECT id INTO brand_tp FROM brands WHERE slug = 'tp-link';
  SELECT id INTO brand_rvi FROM brands WHERE slug = 'rvi';

  INSERT INTO products (name, slug, sku, description, category_id, brand_id, price, dealer_price, stock_qty, is_featured, thumbnail_url, specifications, warranty_months) VALUES
  ('Hikvision DS-2CD2143G2-I 4MP AcuSense IP Camera', 'hikvision-ds-2cd2143g2-i', 'HIK-2CD2143G2', 'High-resolution 4MP AcuSense IP bullet camera with deep learning algorithm for superior detection accuracy.', cat_ip, brand_hik, 89.99, 76.49, 145, true, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_c6cf52de-3abb-49ac-9a0e-e4af1d330bb9.jpg', '{"resolution":"4MP (2560×1440)","lens":"2.8mm","ir_range":"60m","protection":"IP67, IK10","compression":"H.265+"}', 24),
  ('Hikvision DS-2CD2347G2H-LI ColorVu 4MP Camera', 'hikvision-ds-2cd2347g2h-li', 'HIK-COLORVU-4MP', 'ColorVu 4MP dome camera with full-color night vision 24/7.', cat_ip, brand_hik, 124.99, 106.24, 89, true, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_f06aa236-b5fc-4d42-8af8-7425ce2f747f.jpg', '{"resolution":"4MP","lens":"2.8mm","type":"ColorVu","night_vision":"Full Color","protection":"IP67"}', 24),
  ('Hikvision DS-2DE4A425IWG-E 4MP PTZ Camera', 'hikvision-ds-2de4a425iwg-e', 'HIK-PTZ-4MP', 'Professional 4MP PTZ network camera with 25x optical zoom and IR up to 100m.', cat_ptz, brand_hik, 349.99, 297.49, 32, true, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e3c2448e-f0c4-43ad-abf8-760c0f988077.jpg', '{"resolution":"4MP","zoom":"25x optical","ir_range":"100m","pan":"360°","tilt":"-15° to 90°"}', 24),
  ('Dahua NVR4108HS-8P-EI 8CH NVR with PoE', 'dahua-nvr4108hs-8p-ei', 'DAH-NVR8P', '8-channel NVR with built-in 8-port PoE switch for easy IP camera installation.', cat_dvr, brand_dahua, 219.99, 186.99, 67, true, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_f799327f-f9c1-4297-99e2-4ecb512a0dc1.jpg', '{"channels":"8","poe_ports":"8","hdd_slots":"1","max_resolution":"8MP","compression":"H.265+/H.265/H.264"}', 24),
  ('Hikvision DS-7616NXI-I2/16P/S NVR 16CH', 'hikvision-ds-7616nxi-i2-16p-s', 'HIK-NVR16P', 'AcuSense 16-channel NVR with 16 PoE ports and deep learning analytics.', cat_dvr, brand_hik, 489.99, 416.49, 28, false, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9b5d34b9-5ce9-4288-97a3-9abcb1ef0fe7.jpg', '{"channels":"16","poe_ports":"16","hdd_slots":"2","max_hdd":"10TB x 2","compression":"H.265+"}', 24),
  ('TP-Link TL-SG1016PE 16-Port PoE+ Switch', 'tp-link-tl-sg1016pe', 'TPL-POE16', '16-port gigabit managed PoE+ switch with 150W total power budget.', cat_switch, brand_tp, 159.99, 135.99, 54, false, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1bb26e8a-d470-4121-a7cc-1b9c477a39bf.jpg', '{"ports":"16","poe_budget":"150W","standard":"802.3at/af","speed":"Gigabit","management":"Web-managed"}', 24),
  ('RVI Security Kit 4-Camera Analog System', 'rvi-analog-kit-4ch', 'RVI-KIT4ANA', 'Complete 4-camera analog security system with DVR and all accessories.', cat_analog, brand_rvi, 299.99, 254.99, 41, true, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_40cf63ee-f4fd-4fc1-8854-ce02e070946f.jpg', '{"cameras":"4x5MP","dvr":"8CH DVR","hdd":"1TB","cables":"4x18m","resolution":"5MP AHD"}', 12),
  ('Dahua ASI7213X-T1 Face Recognition Terminal', 'dahua-asi7213x-t1', 'DAH-FACE-TERM', 'AI-powered face recognition access control terminal with 30,000 face capacity.', cat_access, brand_dahua, 429.99, 365.49, 19, false, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1f2e1d83-4c07-4dbd-99d3-89c06ca8dfc9.jpg', '{"capacity":"30,000 faces","temperature_detection":"Yes","mask_detection":"Yes","display":"7\" LCD","interface":"TCP/IP"}', 12),
  ('Hikvision DS-2CD2T47G2-L 4MP Bullet ColorVu', 'hikvision-ds-2cd2t47g2-l', 'HIK-BULLET-4MP', 'Outdoor 4MP fixed bullet network camera with ColorVu technology.', cat_ip, brand_hik, 99.99, 84.99, 112, true, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_8b9d8652-51b2-4b70-9341-81bc00188e6b.jpg', '{"resolution":"4MP","type":"ColorVu Bullet","ir_range":"60m","lens":"2.8mm/4mm","protection":"IP67"}', 24),
  ('Professional IP Camera Full Security System', 'pro-ip-camera-system', 'PRO-SYS-IP', 'Complete professional IP camera security system for business installations.', cat_ip, brand_hik, 1299.99, 1104.99, 15, true, 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1dce9933-b447-420c-9998-6811960da4ab.jpg', '{"cameras":"8x4MP","nvr":"16CH NVR","hdd":"4TB","poe_switch":"Included","warranty":"2 years"}', 24);
END $$;

-- Seed blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, thumbnail_url, is_published, published_at) VALUES
('How to Choose the Right CCTV System for Your Business', 'how-to-choose-cctv-system', 'Choosing the right CCTV system for your business requires careful consideration of several key factors. First, assess the areas you need to monitor and the level of detail required. High-traffic areas like entrances and cash registers typically need higher resolution cameras (4MP or above). Next, consider the lighting conditions — ColorVu technology provides full-color images even in near-zero light conditions, making it ideal for poorly lit areas. For outdoor installations, ensure cameras have IP67 protection rating. PoE (Power over Ethernet) cameras simplify installation by using a single cable for both power and data. Finally, choose NVR storage capacity based on the number of cameras, resolution, and required retention period.', 'A comprehensive guide to selecting the perfect security camera system for your business needs.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1dce9933-b447-420c-9998-6811960da4ab.jpg', true, now() - interval '7 days'),
('Hikvision AcuSense Technology Explained', 'hikvision-acusense-technology', 'Hikvision AcuSense technology uses deep learning algorithms to differentiate between humans and vehicles versus other objects. This dramatically reduces false alarms triggered by animals, leaves, or other non-threatening movements. The system analyzes visual features in real-time and can trigger immediate alerts when a human or vehicle is detected in restricted areas. AcuSense cameras are ideal for perimeter protection, where distinguishing real threats from environmental noise is critical. This technology is built into the latest generation of Hikvision IP cameras and NVR systems, offering enterprise-grade analytics at accessible price points.', 'Deep dive into Hikvision''s AI-powered detection technology that reduces false alarms by 90%.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_f06aa236-b5fc-4d42-8af8-7425ce2f747f.jpg', true, now() - interval '14 days'),
('PoE vs Traditional Power: Which Is Right for Your Camera Installation?', 'poe-vs-traditional-power-cameras', 'Power over Ethernet (PoE) has revolutionized IP camera installations by eliminating the need for separate power cables. A single Cat5e/Cat6 cable carries both data and power, simplifying installation and reducing costs. Standard PoE (IEEE 802.3af) provides up to 15.4W per port, sufficient for most IP cameras. PoE+ (IEEE 802.3at) delivers up to 30W, supporting PTZ cameras and cameras with built-in heaters. The main advantage is flexibility — cameras can be placed anywhere within 100m of a PoE switch without needing a nearby power outlet. Traditional power installations require both an Ethernet cable and a power cable, plus the cost of nearby electrical outlets.', 'Compare PoE and traditional power solutions for IP camera installations.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1bb26e8a-d470-4121-a7cc-1b9c477a39bf.jpg', true, now() - interval '21 days');
