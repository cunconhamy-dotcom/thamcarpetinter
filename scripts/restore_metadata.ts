import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { collections } from './temp_collections.js'; // Wait, tsx can import .ts using .js extension or we can just name it .ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  for (const col of collections) {
    console.log('Restoring metadata for', col.id);
    const metadata = {
      products: col.products,
      gallery: col.gallery,
      productImages: col.productImages,
      resources: col.resources
    };

    const { error } = await supabase.from('collections')
      .update({ metadata: metadata })
      .eq('slug', col.id);
      
    if (error) {
       console.error('Error updating', col.id, error);
    } else {
       console.log('Success', col.id);
    }
  }
}

main().catch(console.error);
