const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  console.log('=== Checking site_config table ===');
  
  // Check if table exists
  const { data, error } = await supabase.from('site_config').select('*');
  
  if (error) {
    console.error('ERROR accessing site_config:', JSON.stringify(error, null, 2));
    return;
  }
  
  console.log('Rows in site_config:', data?.length ?? 0);
  if (data && data.length > 0) {
    data.forEach(row => {
      console.log('\n--- Row ---');
      console.log('key:', row.key);
      console.log('value:', JSON.stringify(row.value, null, 2));
    });
  } else {
    console.log('>>> site_config is EMPTY! Settings were never saved to DB.');
  }

  // Also check if settings page is using localStorage instead
  console.log('\n=== Checking SettingsPage save logic ===');
  const fs = require('fs');
  const code = fs.readFileSync('src/pages/admin/SettingsPage.tsx', 'utf-8');
  const hasLocalStorage = code.includes('localStorage');
  const hasSupabaseSave = code.includes("supabase.from('site_config')") || code.includes('supabase.from("site_config")');
  console.log('Uses localStorage:', hasLocalStorage);
  console.log('Saves to Supabase site_config:', hasSupabaseSave);
  
  // Check what the handleSave function does
  const saveStart = code.indexOf('handleSave');
  if (saveStart !== -1) {
    const snippet = code.substring(saveStart, saveStart + 800);
    console.log('\nhandleSave snippet:\n', snippet);
  }
}

check().catch(console.error);
