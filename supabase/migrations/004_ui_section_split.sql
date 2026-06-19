-- ============================================
-- Migration: 004_ui_section_split
-- Description: Split UI sections into dedicated tables for collections and add product specifications
-- ============================================

-- 1. ui_hero_sections
CREATE TABLE IF NOT EXISTS public.ui_hero_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. collection_value_points
CREATE TABLE IF NOT EXISTS public.collection_value_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    point_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. collection_galleries
CREATE TABLE IF NOT EXISTS public.collection_galleries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. collection_resources
CREATE TABLE IF NOT EXISTS public.collection_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    resource_type TEXT NOT NULL, -- e.g., 'brochure', 'specification', 'installation'
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. product_specs
CREATE TABLE IF NOT EXISTS public.product_specs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
    pile_type TEXT,
    construction TEXT,
    backing TEXT,
    size TEXT,
    installation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_ui_hero_sections_collection_id ON public.ui_hero_sections(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_value_points_collection_id ON public.collection_value_points(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_galleries_collection_id ON public.collection_galleries(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_resources_collection_id ON public.collection_resources(collection_id);
CREATE INDEX IF NOT EXISTS idx_product_specs_product_id ON public.product_specs(product_id);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE public.ui_hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_value_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public ui_hero_sections are viewable by everyone" ON public.ui_hero_sections FOR SELECT USING (true);
CREATE POLICY "Public collection_value_points are viewable by everyone" ON public.collection_value_points FOR SELECT USING (true);
CREATE POLICY "Public collection_galleries are viewable by everyone" ON public.collection_galleries FOR SELECT USING (true);
CREATE POLICY "Public collection_resources are viewable by everyone" ON public.collection_resources FOR SELECT USING (true);
CREATE POLICY "Public product_specs are viewable by everyone" ON public.product_specs FOR SELECT USING (true);

-- Authenticated manage access
CREATE POLICY "Authenticated users can manage ui_hero_sections" ON public.ui_hero_sections USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage collection_value_points" ON public.collection_value_points USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage collection_galleries" ON public.collection_galleries USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage collection_resources" ON public.collection_resources USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage product_specs" ON public.product_specs USING (auth.role() = 'authenticated');
