import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const sqlPath = path.resolve(__dirname, '../supabase/migrations/002_seed_rich_collections.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  const matches = [...sqlContent.matchAll(/VALUES\s*\(\s*'([^']+)',\s*'([^']+)'[\s\S]*?'(\{.*?\})'::jsonb/g)];
  
  console.log(`Found ${matches.length} collections in SQL.`);
  
  // Login to bypass RLS
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@carpetsinter.vn',
    password: 'admin123'
  });
  
  if (authError) {
    console.error('Login failed:', authError);
    return;
  }
  console.log('Logged in as:', authData.user.email);

  for (const match of matches) {
     const slug = match[2];
     let jsonStr = match[3];
     try {
       const metadata = JSON.parse(jsonStr);
       console.log('Restoring metadata for', slug, 'Products:', metadata.products?.length || 0);
       
       const { error } = await supabase.from('collections')
         .update({ metadata: metadata })
         .eq('slug', slug);
         
       if (error) {
          console.error('Error updating', slug, error);
       } else {
          console.log('Success', slug);
       }
     } catch(e) {
       console.error('JSON parse failed for', slug);
     }
  }
}

main().catch(console.error);
