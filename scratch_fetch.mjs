import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wdmjdayxaudravihloei.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWpkYXl4YXVkcmF2aWhsb2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODcwNTcsImV4cCI6MjA5NDA2MzA1N30.aSVQeg29lYSz83RwcFQKlhp5up6DY30odPi2sQTTEi0'
);

async function main() {
  const { data, error } = await supabase.from('collections').select('id, slug, name, metadata');
  if (error) {
    console.error('Error fetching collections:', error);
  } else {
    console.log(`Fetched ${data?.length || 0} collections.`);
    if (data?.length > 0) {
      console.log('Sample slugs:', data.map(c => c.slug).join(', '));
      console.log('Sample metadata exists:', !!data[0].metadata);
    }
  }
}

main();
