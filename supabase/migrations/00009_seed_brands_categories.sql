-- ─── Brands ───────────────────────────────────────────────────────────────────
INSERT INTO brands (name, slug, logo_url, description, is_active, sort_order) VALUES
  ('Hikvision', 'hikvision', NULL, 'Dünya lider CCTV istehsalçısı',         true, 1),
  ('Dahua',     'dahua',     NULL, 'Yüksək keyfiyyətli güvenlik kameraları', true, 2),
  ('Uniview',   'uniview',   NULL, 'UNV IP kamera sistemləri',               true, 3),
  ('Reolink',   'reolink',   NULL, 'Ağıllı ev güvenlik sistemi',             true, 4),
  ('TP-Link',   'tp-link',   NULL, 'Şəbəkə avadanlığı',                     true, 5)
ON CONFLICT (slug) DO NOTHING;

-- ─── Categories ────────────────────────────────────────────────────────────────
INSERT INTO categories (name, name_az, name_ru, slug, description, is_active, sort_order) VALUES
  ('Daxili kameralar',  'Daxili kameralar',  'Внутренние камеры',   'indoor-cameras',   'Ev və ofis üçün daxili IP kameralar',         true, 1),
  ('Xarici kameralar',  'Xarici kameralar',  'Уличные камеры',      'outdoor-cameras',  'İqlim qorumalı xarici güvenlik kameraları',   true, 2),
  ('IP kameralar',      'IP kameralar',      'IP-камеры',           'ip-cameras',       'Şəbəkə üzərindən idarə olunan IP kameralar',  true, 3),
  ('Analog kameralar',  'Analog kameralar',  'Аналоговые камеры',   'analog-cameras',   'AHD/TVI/CVI analog kameralar',                true, 4),
  ('DVR / NVR',         'DVR / NVR',         'DVR / NVR',           'dvr-nvr',          'Daimi yazma cihazları',                       true, 5),
  ('Switch',            'Switch',            'Коммутаторы',         'switches',         'PoE və şəbəkə switchləri',                    true, 6),
  ('Giriş nəzarəti',   'Giriş nəzarəti',   'Контроль доступа',    'access-control',   'Elektron qapı kilidləri və kartlı sistemlər', true, 7),
  ('Kabel & Aksesuar',  'Kabel & Aksesuar',  'Кабели и аксессуары', 'accessories',      'Kabel, adaptor, quraşdırma aksesuarları',     true, 8)
ON CONFLICT (slug) DO NOTHING;