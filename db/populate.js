const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS parts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE parts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  brand VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=500',
  rating NUMERIC(3, 2) DEFAULT 0.0,
  quantity INTEGER DEFAULT 0,
  price NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ 
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_parts_updated_at 
  BEFORE UPDATE ON parts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

INSERT INTO categories (name) 
VALUES
  ('Keyboards'),
  ('Mouse'),
  ('Monitors'),
  ('Headsets'),
  ('Consoles'),
  ('CPU'),
  ('GPU'),
  ('RAM'),
  ('SSD'),
  ('HDD')
ON CONFLICT (name) DO NOTHING;

INSERT INTO parts (category_id, brand, name, description, rating, quantity, price)
VALUES

-- KEYBOARDS
((SELECT id FROM categories WHERE name = 'Keyboards'),
 'Keychron', 'K2 V2',
 'Wireless mechanical keyboard with hot-swappable switches and RGB backlighting.',
 4.8, 12, 89.99),

((SELECT id FROM categories WHERE name = 'Keyboards'),
 'Razer', 'BlackWidow V4',
 'Mechanical gaming keyboard with customizable RGB and tactile switches.',
 4.7, 8, 169.99),

((SELECT id FROM categories WHERE name = 'Keyboards'),
 'SteelSeries', 'Apex Pro TKL',
 'Tournament-grade keyboard with adjustable OmniPoint switches.',
 4.9, 5, 199.99),

((SELECT id FROM categories WHERE name = 'Keyboards'),
 'Corsair', 'K70 RGB Pro',
 'Premium mechanical gaming keyboard with aluminum frame.',
 4.7, 10, 159.99),

((SELECT id FROM categories WHERE name = 'Keyboards'),
 'Logitech', 'G Pro X TKL',
 'Compact esports keyboard with swappable switches.',
 4.6, 7, 149.99),

((SELECT id FROM categories WHERE name = 'Keyboards'),
 'HyperX', 'Alloy Origins',
 'Compact mechanical keyboard with durable aluminum body.',
 4.5, 11, 109.99),


-- MOUSE
((SELECT id FROM categories WHERE name = 'Mouse'),
 'Logitech', 'G502 X Lightspeed',
 'Wireless gaming mouse with HERO sensor and customizable buttons.',
 4.8, 14, 149.99),

((SELECT id FROM categories WHERE name = 'Mouse'),
 'Razer', 'DeathAdder V3 Pro',
 'Ultra-lightweight esports gaming mouse.',
 4.9, 9, 159.99),

((SELECT id FROM categories WHERE name = 'Mouse'),
 'SteelSeries', 'Aerox 5',
 'Lightweight RGB gaming mouse with honeycomb shell.',
 4.6, 6, 99.99),

((SELECT id FROM categories WHERE name = 'Mouse'),
 'Corsair', 'Sabre RGB Pro',
 'FPS-focused gaming mouse with ultra-fast polling rate.',
 4.5, 13, 79.99),

((SELECT id FROM categories WHERE name = 'Mouse'),
 'Glorious', 'Model O',
 'Lightweight wired gaming mouse designed for competitive play.',
 4.7, 10, 59.99),


-- MONITORS
((SELECT id FROM categories WHERE name = 'Monitors'),
 'LG', 'UltraGear 27GP850-B',
 '27-inch QHD gaming monitor with 165Hz refresh rate.',
 4.8, 5, 399.99),

((SELECT id FROM categories WHERE name = 'Monitors'),
 'Samsung', 'Odyssey G5',
 'Curved gaming monitor with 144Hz refresh rate.',
 4.6, 8, 299.99),

((SELECT id FROM categories WHERE name = 'Monitors'),
 'ASUS', 'TUF Gaming VG27AQ',
 'IPS gaming monitor with G-Sync compatibility.',
 4.7, 7, 349.99),

((SELECT id FROM categories WHERE name = 'Monitors'),
 'Dell', 'S2721DGF',
 '27-inch IPS gaming monitor with vibrant colors and fast response.',
 4.8, 6, 429.99),

((SELECT id FROM categories WHERE name = 'Monitors'),
 'AOC', '24G2',
 'Affordable 144Hz gaming monitor with IPS panel.',
 4.5, 15, 199.99),


-- HEADSETS
((SELECT id FROM categories WHERE name = 'Headsets'),
 'SteelSeries', 'Arctis Nova Pro',
 'Premium gaming headset with active noise cancellation.',
 4.8, 4, 349.99),

((SELECT id FROM categories WHERE name = 'Headsets'),
 'HyperX', 'Cloud II',
 'Comfortable gaming headset with virtual surround sound.',
 4.7, 12, 99.99),

((SELECT id FROM categories WHERE name = 'Headsets'),
 'Logitech', 'G Pro X',
 'Esports headset with Blue VO!CE microphone technology.',
 4.6, 9, 129.99),

((SELECT id FROM categories WHERE name = 'Headsets'),
 'Razer', 'BlackShark V2',
 'Lightweight esports headset with THX spatial audio.',
 4.7, 8, 109.99),

((SELECT id FROM categories WHERE name = 'Headsets'),
 'Corsair', 'HS80 RGB Wireless',
 'Wireless gaming headset with Dolby Atmos support.',
 4.5, 7, 149.99),


-- CONSOLES
((SELECT id FROM categories WHERE name = 'Consoles'),
 'Sony', 'PlayStation 5',
 'Next-generation gaming console with ultra-fast SSD.',
 4.9, 3, 499.99),

((SELECT id FROM categories WHERE name = 'Consoles'),
 'Microsoft', 'Xbox Series X',
 'High-performance gaming console with 4K gaming support.',
 4.8, 4, 499.99),

((SELECT id FROM categories WHERE name = 'Consoles'),
 'Nintendo', 'Switch OLED',
 'Hybrid gaming console with vibrant OLED display.',
 4.8, 10, 349.99),

((SELECT id FROM categories WHERE name = 'Consoles'),
 'Valve', 'Steam Deck OLED',
 'Portable handheld gaming PC with OLED display.',
 4.9, 5, 549.99),


-- CPU
((SELECT id FROM categories WHERE name = 'CPU'),
 'AMD', 'Ryzen 7 7800X3D',
 'High-end gaming processor with 3D V-Cache technology.',
 4.9, 6, 389.99),

((SELECT id FROM categories WHERE name = 'CPU'),
 'Intel', 'Core i7-14700K',
 'Powerful hybrid-core gaming and productivity processor.',
 4.8, 7, 409.99),

((SELECT id FROM categories WHERE name = 'CPU'),
 'AMD', 'Ryzen 5 7600',
 'Efficient mid-range processor for gaming builds.',
 4.7, 10, 229.99),

((SELECT id FROM categories WHERE name = 'CPU'),
 'Intel', 'Core i5-14600K',
 'Excellent value gaming CPU with strong multi-core performance.',
 4.8, 9, 319.99),


-- GPU
((SELECT id FROM categories WHERE name = 'GPU'),
 'NVIDIA', 'RTX 4090',
 'Flagship graphics card for 4K gaming and AI workloads.',
 4.9, 2, 1599.99),

((SELECT id FROM categories WHERE name = 'GPU'),
 'NVIDIA', 'RTX 4070 Super',
 'High-performance graphics card for 1440p gaming.',
 4.8, 5, 599.99),

((SELECT id FROM categories WHERE name = 'GPU'),
 'AMD', 'Radeon RX 7800 XT',
 'Powerful AMD graphics card for high refresh-rate gaming.',
 4.7, 6, 499.99),

((SELECT id FROM categories WHERE name = 'GPU'),
 'Intel', 'Arc A770',
 'Intel discrete GPU with strong AV1 encoding support.',
 4.4, 8, 349.99),


-- RAM
((SELECT id FROM categories WHERE name = 'RAM'),
 'Corsair', 'Vengeance DDR5 32GB',
 'High-speed DDR5 memory kit for gaming PCs.',
 4.8, 20, 129.99),

((SELECT id FROM categories WHERE name = 'RAM'),
 'G.Skill', 'Trident Z5 RGB 32GB',
 'RGB DDR5 memory kit optimized for high performance.',
 4.9, 14, 149.99),

((SELECT id FROM categories WHERE name = 'RAM'),
 'Kingston', 'Fury Beast DDR4 16GB',
 'Reliable DDR4 RAM kit for mainstream gaming builds.',
 4.6, 18, 69.99),

((SELECT id FROM categories WHERE name = 'RAM'),
 'TeamGroup', 'T-Force Delta RGB 32GB',
 'RGB memory kit with aggressive heatsink design.',
 4.5, 11, 119.99),


-- SSD
((SELECT id FROM categories WHERE name = 'SSD'),
 'Samsung', '990 Pro 2TB',
 'High-end PCIe 4.0 NVMe SSD with blazing-fast speeds.',
 4.9, 8, 189.99),

((SELECT id FROM categories WHERE name = 'SSD'),
 'WD', 'Black SN850X 1TB',
 'Gaming-focused NVMe SSD with excellent performance.',
 4.8, 9, 119.99),

((SELECT id FROM categories WHERE name = 'SSD'),
 'Crucial', 'P3 Plus 1TB',
 'Affordable PCIe Gen4 SSD for mainstream systems.',
 4.6, 15, 79.99),

((SELECT id FROM categories WHERE name = 'SSD'),
 'Kingston', 'NV2 1TB',
 'Budget-friendly NVMe SSD with solid everyday performance.',
 4.4, 17, 59.99),


-- HDD
((SELECT id FROM categories WHERE name = 'HDD'),
 'Seagate', 'Barracuda 2TB',
 'Reliable desktop hard drive for mass storage.',
 4.5, 13, 59.99),

((SELECT id FROM categories WHERE name = 'HDD'),
 'Western Digital', 'Blue 4TB',
 'Large-capacity HDD for games and media storage.',
 4.6, 10, 89.99),

((SELECT id FROM categories WHERE name = 'HDD'),
 'Seagate', 'IronWolf 8TB',
 'NAS-focused hard drive built for 24/7 operation.',
 4.7, 5, 199.99),

((SELECT id FROM categories WHERE name = 'HDD'),
 'Toshiba', 'X300 6TB',
 'Performance desktop hard drive with large capacity.',
 4.5, 6, 149.99);
`;

async function main() {
  try {
    console.log("seeding...");
    const client = new Client({
      connectionString: process.env.DB_URI,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done seeding");
  } catch (error) {
    console.error("Failed to initialize db: ", error);
    throw new Error(`Failed to initialize db: ${error.message}`);
  }
}

main().catch((error) => console.error("Top level error (populate.js):", err));
