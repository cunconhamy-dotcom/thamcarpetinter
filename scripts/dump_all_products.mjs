import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: collections } = await supabase.from('collections').select('id, name, slug');
  console.log(`Loaded ${collections.length} collections.`);

  for (const col of collections) {
    const { data: products } = await supabase.from('products').select('*').eq('collection_id', col.id);
    console.log(`\nCOLLECTION: ${col.slug} (${products.length} products)`);
    products.forEach(p => {
      console.log(`  - ${p.code}: "${p.name}"`);
      console.log(`    Highlights:`, p.highlights);
      console.log(`    Spec:`, p.spec);
    });
  }
}

run();
