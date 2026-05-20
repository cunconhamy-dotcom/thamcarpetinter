-- Add metadata column to collections table to store unstructured scraped data
ALTER TABLE collections ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
