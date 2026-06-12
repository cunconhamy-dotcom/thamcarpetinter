-- Migration: Create knowledge_documents table and storage bucket for AI RAG
-- This will store extracted text from uploaded PDF/TXT/DOCX files.

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  file_size BIGINT DEFAULT 0,
  content_text TEXT,
  status TEXT DEFAULT 'pending', -- pending, ready, error
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "knowledge_read_all" ON knowledge_documents 
  FOR SELECT USING (true); -- Usually we'd restrict this, but keeping it simple

CREATE POLICY "knowledge_insert_auth" ON knowledge_documents 
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "knowledge_update_auth" ON knowledge_documents 
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "knowledge_delete_auth" ON knowledge_documents 
  FOR DELETE TO authenticated USING (true);

-- Insert bucket for knowledge if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('knowledge', 'knowledge', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for knowledge bucket
CREATE POLICY "knowledge_bucket_read_auth" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'knowledge');

CREATE POLICY "knowledge_bucket_insert_auth" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'knowledge');

CREATE POLICY "knowledge_bucket_delete_auth" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'knowledge');
