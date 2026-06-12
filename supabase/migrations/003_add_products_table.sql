-- ============================================
-- Migration: Add Products Table for Relational Management
-- ============================================

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  spec JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add an index for faster lookups by collection
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON products(collection_id);

-- 3. Delete the "upstream" collection as requested
DELETE FROM collections WHERE slug = 'upstream';

-- 4. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Anyone can view, only authenticated can manage
CREATE POLICY "Public products are viewable by everyone" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert products" 
  ON products FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" 
  ON products FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" 
  ON products FOR DELETE 
  USING (auth.role() = 'authenticated');
