import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkTranslations() {
  const { data: collections, error: err } = await supabase
    .from('collections')
    .select('id, name, slug, tagline, summary, detail, quick_facts, value_points, applications')
    .eq('status', 'published');

  if (err) {
    console.error('Error fetching collections:', err.message);
    return;
  }

  console.log(`--- COLLECTIONS STATUS ---`);
  for (const col of collections) {
    console.log(`\nCollection: ${col.name} (${col.slug})`);
    console.log(`- Tagline: ${col.tagline}`);
    console.log(`- Summary: ${col.summary ? col.summary.substring(0, 80) + '...' : 'NONE'}`);
    console.log(`- Detail: ${col.detail ? col.detail.substring(0, 80) + '...' : 'NONE'}`);
    console.log(`- Quick Facts:`, col.quick_facts);
    console.log(`- Value Points:`, col.value_points);
    console.log(`- Applications:`, col.applications);

    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('code, name, highlights, spec')
      .eq('collection_id', col.id);

    if (prodErr) {
      console.error(`Error fetching products for ${col.slug}:`, prodErr.message);
      continue;
    }

    console.log(`- Products (${products?.length || 0}):`);
    if (products && products.length > 0) {
      // Print first product info as sample
      const p = products[0];
      console.log(`  * Sample Product: ${p.code} - ${p.name}`);
      console.log(`  * Highlights:`, p.highlights);
      console.log(`  * Spec useCase:`, p.spec?.useCase);
    }
  }
}

checkTranslations();
