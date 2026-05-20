import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { collections } from '../src/lib/collections.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Helper to escape SQL strings
const escapeSql = (str: string) => str.replace(/'/g, "''")

// Helper to format string arrays to SQL arrays
const formatStringArray = (arr: string[] | undefined) => {
  if (!arr || arr.length === 0) return "'{}'"
  const joined = arr.map(item => `"${escapeSql(item).replace(/"/g, '\\"')}"`).join(',')
  return `'{${joined}}'`
}

const generateSql = () => {
  let sql = `-- Migration to seed the 9 rich collections from local data\n\n`

  for (const collection of collections) {
    const metadata = {
      products: collection.products,
      gallery: collection.gallery,
      productImages: collection.productImages,
      resources: collection.resources
    }

    const name = escapeSql(collection.name)
    const slug = escapeSql(collection.id)
    const tagline = escapeSql(collection.tagline)
    const summary = escapeSql(collection.summary)
    const detail = escapeSql(collection.detail)
    const hero_image = escapeSql(collection.heroImage)
    const accent = escapeSql(collection.accent)
    const status = 'published'

    const quick_facts_sql = formatStringArray(collection.quickFacts)
    const value_points_sql = formatStringArray(collection.valuePoints)
    const applications_sql = formatStringArray(collection.applications)
    const metadata_sql = escapeSql(JSON.stringify(metadata))

    sql += `
INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, accent, quick_facts, value_points, applications, status, metadata)
VALUES (
    '${name}',
    '${slug}',
    '${tagline}',
    '${summary}',
    '${detail}',
    '${hero_image}',
    '${accent}',
    ${quick_facts_sql},
    ${value_points_sql},
    ${applications_sql},
    '${status}',
    '${metadata_sql}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    accent = EXCLUDED.accent,
    quick_facts = EXCLUDED.quick_facts,
    value_points = EXCLUDED.value_points,
    applications = EXCLUDED.applications,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();
`
  }

  const outPath = path.resolve(__dirname, '../supabase/migrations/002_seed_rich_collections.sql')
  fs.writeFileSync(outPath, sql, 'utf8')
  console.log(`Generated SQL at ${outPath}`)
}

generateSql()
