-- Insert sample products using brand/category slugs
WITH
  b_hik AS (SELECT id FROM brands WHERE slug='hikvision' LIMIT 1),
  b_dah AS (SELECT id FROM brands WHERE slug='dahua' LIMIT 1),
  b_unv AS (SELECT id FROM brands WHERE slug='uniview' LIMIT 1),
  b_tpl AS (SELECT id FROM brands WHERE slug='tp-link' LIMIT 1),
  c_ind AS (SELECT id FROM categories WHERE slug='indoor-cameras' LIMIT 1),
  c_out AS (SELECT id FROM categories WHERE slug='outdoor-cameras' LIMIT 1),
  c_ip  AS (SELECT id FROM categories WHERE slug='ip-cameras' LIMIT 1),
  c_dvr AS (SELECT id FROM categories WHERE slug='dvr-nvr' LIMIT 1),
  c_sw  AS (SELECT id FROM categories WHERE slug='switches' LIMIT 1),
  c_acc AS (SELECT id FROM categories WHERE slug='access-control' LIMIT 1)

INSERT INTO products
  (name, name_az, name_ru, slug, sku, description, category_id, brand_id,
   price, dealer_price, distributor_price, cost_price,
   stock_qty, is_active, is_featured, warranty_months,
   specifications)
VALUES
  -- Hikvision indoor dome
  ('Hikvision DS-2CD2143G2-I 4MP Indoor Dome',
   'Hikvision DS-2CD2143G2-I 4MP Daxili Dome Kamera',
   'Hikvision DS-2CD2143G2-I 4МП внутренняя купольная',
   'hikvision-ds-2cd2143g2-i',
   'HIK-DS2CD2143G2I',
   '4MP AcuSense Fixed Dome Network Camera, IR 40m, H.265+',
   (SELECT id FROM c_ind), (SELECT id FROM b_hik),
   185.00, 157.25, 166.50, 130.00,
   15, true, true, 24,
   '{"resolution":"4MP","ir_range":"40m","compression":"H.265+","ip_rating":"IP67"}'::jsonb),

  -- Hikvision outdoor bullet
  ('Hikvision DS-2CD2T47G2-L 4MP ColorVu Bullet',
   'Hikvision DS-2CD2T47G2-L 4MP ColorVu Xarici Bullet',
   'Hikvision DS-2CD2T47G2-L 4МП ColorVu уличная пулевидная',
   'hikvision-ds-2cd2t47g2-l',
   'HIK-DS2CD2T47G2L',
   '4MP ColorVu Fixed Turret Network Camera — rəngli gecə görüntüsü',
   (SELECT id FROM c_out), (SELECT id FROM b_hik),
   220.00, 187.00, 198.00, 155.00,
   8, true, true, 24,
   '{"resolution":"4MP","color_night_vision":true,"ir_range":"60m","ip_rating":"IP67"}'::jsonb),

  -- Hikvision NVR 8ch
  ('Hikvision DS-7608NI-K2 8ch NVR',
   'Hikvision DS-7608NI-K2 8 Kanallı NVR',
   'Hikvision DS-7608NI-K2 8-канальный NVR',
   'hikvision-ds-7608ni-k2',
   'HIK-DS7608NIK2',
   '8-channel 4K NVR with 2 SATA HDD slots, H.265+',
   (SELECT id FROM c_dvr), (SELECT id FROM b_hik),
   320.00, 272.00, 288.00, 225.00,
   6, true, true, 24,
   '{"channels":8,"max_resolution":"4K","hdd_slots":2,"compression":"H.265+"}'::jsonb),

  -- Dahua outdoor PTZ
  ('Dahua SD49425XB-HNR 4MP Smart PTZ',
   'Dahua SD49425XB-HNR 4MP Ağıllı PTZ Kamera',
   'Dahua SD49425XB-HNR 4МП Smart PTZ',
   'dahua-sd49425xb-hnr',
   'DAH-SD49425XB',
   '4MP Full-color Active Deterrence Fixed-focal PT Network Camera',
   (SELECT id FROM c_out), (SELECT id FROM b_dah),
   410.00, 348.50, 369.00, 290.00,
   4, true, true, 24,
   '{"resolution":"4MP","ptz":true,"zoom":"25x","ir_range":"100m"}'::jsonb),

  -- Uniview IP camera
  ('Uniview IPC3614SB-ADF28KM 4MP LightHunter',
   'Uniview IPC3614SB-ADF28KM 4MP LightHunter Kamera',
   'Uniview IPC3614SB-ADF28KM 4МП LightHunter',
   'uniview-ipc3614sb-adf28km',
   'UNV-IPC3614SB',
   '4MP LightHunter Fixed Dome Network Camera with mic',
   (SELECT id FROM c_ip), (SELECT id FROM b_unv),
   175.00, 148.75, 157.50, 125.00,
   10, true, false, 24,
   '{"resolution":"4MP","built_in_mic":true,"ir_range":"30m","ip_rating":"IP67"}'::jsonb),

  -- TP-Link PoE Switch
  ('TP-Link TL-SG1008P 8-Port PoE Switch',
   'TP-Link TL-SG1008P 8 Portlu PoE Switch',
   'TP-Link TL-SG1008P 8-портовый PoE коммутатор',
   'tp-link-tl-sg1008p',
   'TPL-TLSG1008P',
   '8-Port Gigabit Desktop/Rackmount Switch with 4-Port PoE+, 64W',
   (SELECT id FROM c_sw), (SELECT id FROM b_tpl),
   95.00, 80.75, 85.50, 67.00,
   20, true, false, 24,
   '{"ports":8,"poe_ports":4,"poe_budget":"64W","speed":"Gigabit"}'::jsonb),

  -- Dahua access control
  ('Dahua DHI-ASI7213Y-V2 Face Recognition Terminal',
   'Dahua DHI-ASI7213Y-V2 Üz Tanıma Terminalı',
   'Dahua DHI-ASI7213Y-V2 Терминал распознавания лиц',
   'dahua-dhi-asi7213y-v2',
   'DAH-ASI7213YV2',
   '2MP Face Recognition Access Control Terminal with temperature screening',
   (SELECT id FROM c_acc), (SELECT id FROM b_dah),
   580.00, 493.00, 522.00, 410.00,
   3, true, true, 24,
   '{"resolution":"2MP","face_recognition":true,"temperature_screening":true,"wiegand":true}'::jsonb),

  -- Hikvision 16ch NVR
  ('Hikvision DS-7616NI-K2 16ch NVR',
   'Hikvision DS-7616NI-K2 16 Kanallı NVR',
   'Hikvision DS-7616NI-K2 16-канальный NVR',
   'hikvision-ds-7616ni-k2',
   'HIK-DS7616NIK2',
   '16-channel embedded 4K NVR, H.265+, 2 SATA HDD',
   (SELECT id FROM c_dvr), (SELECT id FROM b_hik),
   480.00, 408.00, 432.00, 340.00,
   5, true, false, 24,
   '{"channels":16,"max_resolution":"4K","hdd_slots":2,"compression":"H.265+"}'::jsonb)

ON CONFLICT (slug) DO NOTHING;