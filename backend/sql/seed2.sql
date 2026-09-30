INSERT INTO products (name, sku, price, quantity, status) VALUES
  ('Notebook 15.6" i5 8GB', 'NOT-011', 3299.00, 8, true),
  ('Roteador Wi-Fi 6 AX1800', 'ROT-012', 329.90, 18, true),
  ('Carregador USB-C 65W', 'CAR-013', 119.90, 45, true),
  ('Pen Drive 64GB', 'PEN-014', 39.90, 120, true),
  ('Microfone Condensador USB', 'MIC-015', 299.00, 6, true),
  ('Suporte Articulado para Monitor', 'SUP-016', 149.90, 22, true),
  ('Fonte 650W 80 Plus Bronze', 'FON-017', 379.00, 0, true),
  ('Placa de Vídeo 6GB', 'GPU-018', 1899.00, 5, true),
  ('Mouse Sem Fio Antigo', 'MOU-019', 49.90, 14, false),
  ('Teclado Membrana Básico', 'TEC-020', 59.90, 9, false)
ON CONFLICT (sku) DO NOTHING;
