import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { collections } from '../src/lib/collections.js'
import { mockNews } from '../src/lib/news.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function escapeSql(str: string) {
  if (!str) return "''"
  return "'" + str.replace(/'/g, "''") + "'"
}

let sql = `-- Seed data for Collections and Blog Posts\n\n`

sql += `-- Collections\n`
for (const c of collections) {
  const imagesArr = c.gallery ? `ARRAY[${c.gallery.map(escapeSql).join(', ')}]` : `ARRAY[]::text[]`
  
  sql += `INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  ${escapeSql(c.name)},
  ${escapeSql(c.id)},
  ${escapeSql(c.tagline)},
  ${escapeSql(c.summary)},
  ${escapeSql(c.detail)},
  ${escapeSql(c.heroImage)},
  'published',
  ${c.products.length}
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;
\n`
}

sql += `\n-- Blog Posts\n`
for (const n of mockNews) {
  const contentJson = escapeSql(JSON.stringify({ html: n.content }))
  sql += `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, status, published_at)
VALUES (
  ${escapeSql(n.title)},
  ${escapeSql(n.slug || n.id)},
  ${escapeSql(n.excerpt)},
  ${contentJson}::jsonb,
  ${escapeSql(n.thumbnailUrl)},
  'published',
  ${escapeSql(n.publishedAt)}
) ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image;
\n`
}

const outputPath = path.resolve(__dirname, 'seed.sql')
fs.writeFileSync(outputPath, sql, 'utf8')
console.log('Generated seed.sql at', outputPath)
