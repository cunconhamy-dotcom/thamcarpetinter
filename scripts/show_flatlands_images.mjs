import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function show() {
  const { data: col } = await supabase.from('collections').select('id').eq('slug', 'flatlands').single();
  if (!col) return console.log('Flatlands not found');

  const { data: products } = await supabase.from('products').select('code, name, image').eq('collection_id', col.id);
  console.log('Flatlands products currently in DB:');
  products.forEach(p => console.log(`- ${p.code}: ${p.name} -> ${p.image}`));
}

show();
