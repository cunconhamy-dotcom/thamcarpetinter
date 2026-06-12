import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkDb() {
  const { data, error } = await supabase.from('collections').select('*').eq('status', 'published').order('sort_order', { ascending: true });
  if (error) {
    console.error('DB Error:', error);
  } else {
    console.log(`Found ${data.length} collections in DB`);
    data.forEach(d => {
       console.log(`- Slug: ${d.slug}, Name: ${d.name}, Status: ${d.status}, Products: ${d.metadata?.products?.length || 0}`);
    });
  }
}

checkDb();
