import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('--- AUDITING COLLECTIONS ---')
  const { data: cols, error: colError } = await supabase.from('collections').select('id, name, slug, metadata').eq('status', 'published')
  
  if (colError) {
    console.error('Error fetching collections', colError)
    return
  }

  for (const col of cols) {
    const { data: prods, error: prodError } = await supabase.from('products').select('id, code, name, image, sort_order').eq('collection_id', col.id).order('code')
    
    console.log(`Collection: ${col.name} (${col.slug}) - DB Products count: ${prods?.length || 0}`)
    
    // Specifically check Discover
    if (col.slug === 'discover' || col.slug === 'discovery') {
      console.log('>>> DISCOVER PRODUCTS in DB:')
      prods?.forEach((p, i) => {
        console.log(`  [${i+1}] Code: ${p.code} - Image: ${p.image}`)
      })

      // Also check metadata.products
      console.log('>>> DISCOVER PRODUCTS in metadata:')
      const metaProds = col.metadata?.products || []
      console.log(`  Metadata count: ${metaProds.length}`)
      metaProds.forEach((p, i) => {
        console.log(`  [${i+1}] Code: ${p.code} - Image: ${p.image}`)
      })
    }
  }

  console.log('Done.')
}

run()
