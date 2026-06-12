import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

const URLs = [
  'https://carpetsinter.com/foundation/',
  'https://carpetsinter.com/groundwork/',
  'https://carpetsinter.com/aspekt-insight/',
  'https://carpetsinter.com/waterloo/',
  'https://carpetsinter.com/architexture-connect/',
  'https://carpetsinter.com/upstream/', // EBB Retreat maps here
  'https://carpetsinter.com/discover/',
  'https://carpetsinter.com/flatlands/',
  'https://carpetsinter.com/aspekt-vue/'
];

async function translateText(text) {
  if (!text || text.trim() === '') return text;
  try {
    const payload = {
      contents: [{ role: "user", parts: [{ text: `Translate the following text to natural, professional Vietnamese for a premium carpet brand website. Only return the translated text without any quotes or explanations. Text:\n${text}` }] }]
    };
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (err) {
    console.error('Translation error:', err.message);
    return text;
  }
}

async function verifyImageUrl(url) {
  if (!url || !url.startsWith('http')) return false;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function run() {
  console.log('Starting Translation and Data Migration process...');

  // 1. Authenticate to bypass RLS
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@carpetsinter.vn',
    password: 'admin123'
  });
  if (authError) {
    console.error('Failed to log in as admin:', authError.message);
    return;
  }
  console.log('Logged in successfully.');

  // 2. Fetch all published collections
  const { data: collections, error: fetchErr } = await supabase.from('collections').select('*').eq('status', 'published');
  if (fetchErr) {
    console.error('Error fetching collections:', fetchErr.message);
    return;
  }

  // 3. Process each collection
  for (const col of collections) {
    console.log(`\nProcessing collection: ${col.name}`);
    
    // Check if Upstream, we were instructed to delete it
    if (col.slug === 'upstream') {
      console.log('Skipping upstream (will be deleted by SQL script).');
      continue;
    }

    // Translate collection metadata
    console.log('- Translating Tagline, Summary, Detail...');
    const translatedTagline = await translateText(col.tagline);
    const translatedSummary = await translateText(col.summary);
    const translatedDetail = await translateText(col.detail);
    
    const translatedQuickFacts = [];
    for (const qf of col.quick_facts || []) translatedQuickFacts.push(await translateText(qf));
    
    const translatedValuePoints = [];
    for (const vp of col.value_points || []) translatedValuePoints.push(await translateText(vp));
    
    const translatedApplications = [];
    for (const ap of col.applications || []) translatedApplications.push(await translateText(ap));

    // Update collection
    const { error: updateErr } = await supabase.from('collections').update({
      tagline: translatedTagline,
      summary: translatedSummary,
      detail: translatedDetail,
      quick_facts: translatedQuickFacts,
      value_points: translatedValuePoints,
      applications: translatedApplications
    }).eq('id', col.id);

    if (updateErr) console.error('Error updating collection:', updateErr.message);
    else console.log('- Collection texts translated and saved.');

    // 4. Migrate Products
    const products = col.metadata?.products || [];
    console.log(`- Migrating ${products.length} products...`);
    
    for (const p of products) {
      // Verify image
      const isValid = await verifyImageUrl(p.image);
      if (!isValid) console.warn(`  ! Warning: Image might be broken for ${p.code}: ${p.image}`);

      // Translate product info
      const translatedName = await translateText(p.name);
      const translatedHighlights = [];
      for (const h of p.highlights || []) translatedHighlights.push(await translateText(h));
      const translatedUseCase = await translateText(p.spec?.useCase || '');

      // Insert into new products table
      const newProduct = {
        collection_id: col.id,
        code: p.code,
        name: translatedName,
        image: p.image,
        highlights: translatedHighlights,
        colors: p.colors || [],
        spec: {
          ...p.spec,
          useCase: translatedUseCase
        }
      };

      // Check if product already exists to avoid duplicates
      const { data: existing } = await supabase.from('products').select('id').eq('code', p.code).eq('collection_id', col.id).maybeSingle();
      
      let prodErr;
      if (existing) {
        const { error } = await supabase.from('products').update(newProduct).eq('id', existing.id);
        prodErr = error;
      } else {
        const { error } = await supabase.from('products').insert([newProduct]);
        prodErr = error;
      }

      if (prodErr) {
        if (prodErr.code === '42P01') {
           console.error('  ERROR: The products table does NOT exist! Please run the SQL migration script first.');
           return;
        }
        console.error(`  Error inserting product ${p.code}:`, prodErr.message);
      } else {
        console.log(`  + Migrated product: ${p.code}`);
      }
    }
  }

  console.log('\nMigration and Translation Complete!');
}

run();
