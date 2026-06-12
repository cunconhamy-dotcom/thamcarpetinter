import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const fixes = [
  { code: 'DV300', newUrl: 'https://carpetsinter.com/wp-content/uploads/2023/04/DV300-DV201.jpg' },
  { code: 'DV900', newUrl: 'https://carpetsinter.com/wp-content/uploads/2022/08/WATERFALL-DV-900.jpg' },
  { code: 'FL02', newUrl: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL02MUCUSSO-1.jpg' },
  { code: 'FL11', newUrl: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL11Lantoto-2.jpg' },
  { code: 'FL15', newUrl: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL15Matobo.jpg' },
  { code: 'FL36', newUrl: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL36NarivareplaceFL16NM016-2150x50cm-3.jpg' }
];

async function run() {
  console.log('Logging in to Supabase...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@carpetsinter.vn',
    password: 'admin123'
  });

  if (authError) {
    console.error('Failed to log in:', authError.message);
    return;
  }
  console.log('Logged in successfully. Updating image URLs...');

  for (const fix of fixes) {
    console.log(`Updating ${fix.code} to ${fix.newUrl}...`);
    const { error } = await supabase.from('products').update({ image: fix.newUrl }).eq('code', fix.code);
    if (error) {
      console.error(`  -> Error updating ${fix.code}:`, error.message);
    } else {
      console.log(`  -> Updated ${fix.code} successfully.`);
    }
  }
  console.log('All image URL updates complete.');
}

run();
