import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data: cols } = await supabase.from('collections').select('id, name, slug, metadata').eq('slug', 'discover')
  
  if (cols && cols.length > 0) {
    const meta = cols[0].metadata
    console.log('Gallery:', meta.gallery)
  }
}

run()
