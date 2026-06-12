import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('--- UPDATING SORT_ORDER & BROKEN IMAGES ---')
  
  // 1. Fetch all products
  const { data: prods, error: prodError } = await supabase.from('products').select('id, collection_id, code').order('code')
  
  if (prodError) {
    console.error('Error fetching products', prodError)
    return
  }

  // 2. Group by collection and update sort_order
  const collectionsMap = new Map()
  prods.forEach(p => {
    if (!collectionsMap.has(p.collection_id)) {
      collectionsMap.set(p.collection_id, [])
    }
    collectionsMap.get(p.collection_id).push(p)
  })

  let count = 0
  for (const [colId, colProds] of collectionsMap.entries()) {
    // colProds is already ordered by code
    for (let i = 0; i < colProds.length; i++) {
      const p = colProds[i]
      const newSortOrder = i + 1 // Start from 1 as requested
      await supabase.from('products').update({ sort_order: newSortOrder }).eq('id', p.id)
      count++
    }
  }
  console.log(`Updated sort_order for ${count} products.`)

  // 3. Fix Discover Gallery images in 'collections' table metadata
  const { data: cols } = await supabase.from('collections').select('id, metadata').eq('slug', 'discover')
  if (cols && cols.length > 0) {
    const discoverCol = cols[0]
    let meta = discoverCol.metadata
    
    // Fix broken gallery images
    if (meta.gallery) {
      meta.gallery = meta.gallery.map(url => {
        if (url.includes('DV300..jpg')) return 'https://carpetsinter.com/wp-content/uploads/2023/04/DV300-DV201.jpg'
        if (url.includes('DV900..jpg')) return 'https://carpetsinter.com/wp-content/uploads/2022/08/WATERFALL-DV-900.jpg'
        return url
      })
    }
    
    // Swap image 1 and 9 in gallery (index 0 and 8) as requested:
    // "đổi vị trí ảnh 9 cho ảnh 1 ở khu vực 7"
    if (meta.gallery && meta.gallery.length >= 9) {
      const temp = meta.gallery[0]
      meta.gallery[0] = meta.gallery[8]
      meta.gallery[8] = temp
      console.log('Swapped gallery image 1 and 9')
    }

    await supabase.from('collections').update({ metadata: meta }).eq('id', discoverCol.id)
    console.log('Updated Discover gallery images.')
  }

  // 4. Also fix any products with these broken images in DB
  await supabase.from('products')
    .update({ image: 'https://carpetsinter.com/wp-content/uploads/2023/04/DV300-DV201.jpg' })
    .like('image', '%DV300..jpg%')
  
  await supabase.from('products')
    .update({ image: 'https://carpetsinter.com/wp-content/uploads/2022/08/WATERFALL-DV-900.jpg' })
    .like('image', '%DV900..jpg%')

  console.log('Done.')
}

run()
