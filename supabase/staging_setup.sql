-- ============================================
-- Carpets Inter Vietnam — STAGING Database Setup
-- Gộp tất cả migrations (chỉ SCHEMA, không có seed data)
-- Paste toàn bộ file này vào Supabase SQL Editor → Run
-- ============================================

-- ============================
-- 001: Initial Schema
-- ============================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'writer', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  detail TEXT DEFAULT '',
  hero_image TEXT DEFAULT '',
  accent TEXT DEFAULT '#f29d38',
  highlights TEXT[] DEFAULT '{}',
  quick_facts TEXT[] DEFAULT '{}',
  value_points TEXT[] DEFAULT '{}',
  applications TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INT DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content JSONB,
  cover_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document')),
  file_size BIGINT DEFAULT 0,
  alt_text TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Only admins can delete profiles" ON profiles FOR DELETE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published collections are viewable by everyone" ON collections FOR SELECT USING (
  status = 'published' OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'writer')
);
CREATE POLICY "Admins can manage collections" ON collections FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are viewable by everyone" ON blog_posts FOR SELECT USING (
  status = 'published' OR auth.uid() = author_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Writers can create posts" ON blog_posts FOR INSERT WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'writer')
);
CREATE POLICY "Writers can update own posts" ON blog_posts FOR UPDATE USING (
  auth.uid() = author_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Only admins can delete posts" ON blog_posts FOR DELETE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media viewable by authenticated users" ON media FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Writers can upload media" ON media FOR INSERT WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'writer')
);
CREATE POLICY "Only admins can delete media" ON media FOR DELETE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site config viewable by all" ON site_config FOR SELECT USING (true);
CREATE POLICY "Only admins can modify site config" ON site_config FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================
-- 003: Products Table
-- ============================

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

CREATE INDEX IF NOT EXISTS idx_products_collection_id ON products(collection_id);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- ============================
-- 004: UI Section Split
-- ============================

CREATE TABLE IF NOT EXISTS public.ui_hero_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, title TEXT, subtitle TEXT,
  order_index INTEGER DEFAULT 0, is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collection_value_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  point_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collection_galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, caption TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collection_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  label TEXT NOT NULL, resource_type TEXT NOT NULL, file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_specs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
  pile_type TEXT, construction TEXT, backing TEXT, size TEXT, installation TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ui_hero_sections_collection_id ON public.ui_hero_sections(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_value_points_collection_id ON public.collection_value_points(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_galleries_collection_id ON public.collection_galleries(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_resources_collection_id ON public.collection_resources(collection_id);
CREATE INDEX IF NOT EXISTS idx_product_specs_product_id ON public.product_specs(product_id);

ALTER TABLE public.ui_hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_value_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public ui_hero_sections are viewable by everyone" ON public.ui_hero_sections FOR SELECT USING (true);
CREATE POLICY "Public collection_value_points are viewable by everyone" ON public.collection_value_points FOR SELECT USING (true);
CREATE POLICY "Public collection_galleries are viewable by everyone" ON public.collection_galleries FOR SELECT USING (true);
CREATE POLICY "Public collection_resources are viewable by everyone" ON public.collection_resources FOR SELECT USING (true);
CREATE POLICY "Public product_specs are viewable by everyone" ON public.product_specs FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage ui_hero_sections" ON public.ui_hero_sections USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage collection_value_points" ON public.collection_value_points USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage collection_galleries" ON public.collection_galleries USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage collection_resources" ON public.collection_resources USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage product_specs" ON public.product_specs USING (auth.role() = 'authenticated');

-- ============================
-- 006: CRM, Leads, Email, Invites
-- ============================

CREATE TABLE IF NOT EXISTS public.user_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'writer', 'viewer')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage invites" ON public.user_invites FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Updated trigger with invite support + error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE invited_role TEXT;
BEGIN
  SELECT role INTO invited_role FROM public.user_invites WHERE email = NEW.email;
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), COALESCE(invited_role, 'viewer'));
  DELETE FROM public.user_invites WHERE email = NEW.email;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error creating profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, email TEXT, phone TEXT, company TEXT,
  project_type TEXT, budget TEXT, message TEXT,
  ai_tags TEXT[] DEFAULT '{}', ai_intent TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'lost', 'won')),
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can manage leads" ON public.leads FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'writer')
);

CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, subject TEXT NOT NULL, body_html TEXT NOT NULL,
  target_audience TEXT DEFAULT 'all',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  sent_count INT DEFAULT 0, scheduled_for TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can manage email campaigns" ON public.email_campaigns FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'writer')
);

-- ============================
-- Add metadata column
-- ============================
ALTER TABLE collections ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- ============================
-- Knowledge Documents (AI RAG)
-- ============================

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, file_name TEXT NOT NULL, file_path TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf', file_size BIGINT DEFAULT 0,
  content_text TEXT, status TEXT DEFAULT 'pending',
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "knowledge_read_all" ON knowledge_documents FOR SELECT USING (true);
CREATE POLICY "knowledge_insert_auth" ON knowledge_documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "knowledge_update_auth" ON knowledge_documents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "knowledge_delete_auth" ON knowledge_documents FOR DELETE TO authenticated USING (true);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('knowledge', 'knowledge', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('collections', 'collections', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "knowledge_bucket_read_auth" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'knowledge');
CREATE POLICY "knowledge_bucket_insert_auth" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'knowledge');
CREATE POLICY "knowledge_bucket_delete_auth" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'knowledge');
CREATE POLICY "Public bucket read" ON storage.objects FOR SELECT USING (bucket_id IN ('collections', 'blog', 'media', 'avatars'));
CREATE POLICY "Auth bucket insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('collections', 'blog', 'media', 'avatars'));
CREATE POLICY "Auth bucket delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('collections', 'blog', 'media', 'avatars'));

-- ✅ DONE! Staging database ready.
