import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

// Delay utility
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translatePackage(pkg) {
  try {
    const prompt = `Translate the values of this JSON object to natural, professional, premium Vietnamese for a high-end commercial carpet brand website. 
Keep all keys, product codes, sizes (e.g. '50 x 50 cm'), and technical values intact unless translating their textual description (like backing or construction details).
Ensure the tone is professional, elegant, and matches premium Vietnamese interior design terminology.
Return ONLY the translated JSON structure matching the input exactly. Do not wrap in markdown code blocks or add explanations.

Here is the JSON object:
${JSON.stringify(pkg)}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${errText}`);
    }

    const data = await res.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);
  } catch (err) {
    console.error('Translation failed:', err.message);
    return null;
  }
}

async function run() {
  console.log('Logging in to Supabase...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@carpetsinter.vn',
    password: 'admin123'
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    return;
  }
  console.log('Logged in successfully.');

  // Fetch collections
  const { data: collections, error: colError } = await supabase
    .from('collections')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (colError) {
    console.error('Error fetching collections:', colError.message);
    return;
  }

  console.log(`Loaded ${collections.length} collections. Beginning translation...`);

  for (const col of collections) {
    console.log(`\n---------------------------------------`);
    console.log(`Processing Collection: ${col.name} (${col.slug})`);

    // Fetch products for this collection
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .eq('collection_id', col.id);

    if (prodError) {
      console.error(`  Error fetching products for ${col.name}:`, prodError.message);
      continue;
    }

    console.log(`  Fetched ${products.length} products.`);

    // Build the package to translate
    const packageToTranslate = {
      collection: {
        tagline: col.tagline || '',
        summary: col.summary || '',
        detail: col.detail || '',
        quick_facts: col.quick_facts || [],
        value_points: col.value_points || [],
        applications: col.applications || []
      },
      products: {}
    };

    for (const p of products) {
      packageToTranslate.products[p.code] = {
        name: p.name || '',
        highlights: p.highlights || [],
        spec: {
          construction: p.spec?.construction || '',
          backing: p.spec?.backing || '',
          installation: p.spec?.installation || '',
          pile: p.spec?.pile || '',
          useCase: p.spec?.useCase || ''
        }
      };
    }

    // Call Gemini API
    console.log('  Calling Gemini API for translation...');
    const translatedPackage = await translatePackage(packageToTranslate);

    if (!translatedPackage) {
      console.error('  Failed to translate this collection. Skipping...');
      await sleep(2000);
      continue;
    }

    console.log('  Translation received. Updating collections table...');
    const tCol = translatedPackage.collection;
    const { error: colUpdateErr } = await supabase
      .from('collections')
      .update({
        tagline: tCol.tagline,
        summary: tCol.summary,
        detail: tCol.detail,
        quick_facts: tCol.quick_facts,
        value_points: tCol.value_points,
        applications: tCol.applications
      })
      .eq('id', col.id);

    if (colUpdateErr) {
      console.error('  Error updating collection fields:', colUpdateErr.message);
    } else {
      console.log('  Collection updated successfully.');
    }

    console.log('  Updating products table...');
    for (const p of products) {
      const tProd = translatedPackage.products[p.code];
      if (!tProd) {
        console.warn(`    Warning: No translation found in response for product ${p.code}`);
        continue;
      }

      const updatedSpec = {
        ...p.spec,
        construction: tProd.spec?.construction || p.spec?.construction,
        backing: tProd.spec?.backing || p.spec?.backing,
        installation: tProd.spec?.installation || p.spec?.installation,
        pile: tProd.spec?.pile || p.spec?.pile,
        useCase: tProd.spec?.useCase || p.spec?.useCase
      };

      const { error: prodUpdateErr } = await supabase
        .from('products')
        .update({
          name: tProd.name,
          highlights: tProd.highlights,
          spec: updatedSpec
        })
        .eq('id', p.id);

      if (prodUpdateErr) {
        console.error(`    Error updating product ${p.code}:`, prodUpdateErr.message);
      }
    }
    console.log(`  Finished updating products for ${col.name}.`);

    // Sleep to prevent rate limit
    console.log('  Waiting 2.5 seconds to respect rate limits...');
    await sleep(2500);
  }

  console.log('\nTranslation process complete for all collections and products!');
}

run();
