import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function verifyImageUrl(url) {
  if (!url || !url.startsWith('http')) return false;
  try {
    const res = await fetch(url, { method: 'HEAD', timeout: 5000 });
    // Check if it's an actual image by content-type
    const contentType = res.headers.get('content-type');
    const isImage = contentType && contentType.startsWith('image/');
    return res.ok && isImage;
  } catch (e) {
    return false;
  }
}

async function run() {
  console.log('Fetching all products to verify images...');

  const { data: products, error } = await supabase.from('products').select('id, code, name, image');
  
  if (error) {
    console.error('Error fetching products:', error.message);
    return;
  }

  let brokenCount = 0;
  console.log(`Found ${products.length} products to check.\n`);

  for (const p of products) {
    process.stdout.write(`Checking ${p.code}... `);
    const isValid = await verifyImageUrl(p.image);
    if (!isValid) {
      console.log(`❌ BROKEN IMAGE: ${p.image}`);
      brokenCount++;
    } else {
      console.log(`✅ OK`);
    }
  }

  console.log(`\nVerification complete. Found ${brokenCount} broken images.`);
}

run();
