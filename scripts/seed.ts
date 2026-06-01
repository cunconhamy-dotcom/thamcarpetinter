import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { collections } from '../src/lib/collections.js'
import { mockNews } from '../src/lib/news.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Logging in...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@carpetsinter.vn',
    password: 'admin123'
  })
  if (authError) {
    console.error('Login failed. Ensure user exists:', authError.message)
    process.exit(1)
  }
  console.log('Logged in as', authData.user?.email)

  console.log('Seeding Collections...')
  for (const c of collections) {
    const { error } = await supabase
      .from('collections')
      .upsert({
        name: c.name,
        slug: c.id,
        tagline: c.tagline,
        summary: c.summary,
        detail: c.detail,
        hero_image: c.heroImage,
        product_count: c.products.length,
        status: 'published'
      }, { onConflict: 'slug' })
    if (error) {
      console.error('Error upserting collection:', c.id, error)
    } else {
      console.log('Upserted collection:', c.id)
    }
  }

  console.log('Seeding News...')
  for (const n of mockNews) {
    const { error } = await supabase
      .from('blog_posts')
      .upsert({
        title: n.title,
        slug: n.slug || n.id,
        excerpt: n.excerpt,
        content: { html: n.content },
        cover_image: n.thumbnailUrl,
        author_id: authData.user?.id,
        status: 'published',
        published_at: n.publishedAt
      }, { onConflict: 'slug' })
    if (error) {
      console.error('Error upserting news:', n.id, error)
    } else {
      console.log('Upserted news:', n.id)
    }
  }
  
  console.log('Seed completed.')
}

seed().catch(console.error)
