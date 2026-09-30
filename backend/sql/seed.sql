INSERT INTO products (name, sku, price, quantity, status) VALUES
  ('Teclado Mecânico RGB', 'TEC-001', 349.90, 25, true),
  ('Mouse Gamer 16000 DPI', 'MOU-002', 189.90, 40, true),
  ('Monitor 24" Full HD', 'MON-003', 899.00, 12, true),
  ('Headset USB 7.1', 'HEA-004', 259.90, 4, true),
  ('Webcam 1080p', 'WEB-005', 219.00, 0, true),
  ('Cabo HDMI 2m', 'CAB-006', 29.90, 150, true),
  ('Mousepad Extra Grande', 'PAD-007', 79.90, 60, true),
  ('Hub USB 3.0 4 Portas', 'HUB-008', 69.90, 3, true),
  ('SSD 480GB SATA', 'SSD-009', 279.00, 30, true),
  ('Cadeira Gamer Modelo Antigo', 'CAD-010', 1199.00, 2, false)
ON CONFLICT (sku) DO NOTHING;
