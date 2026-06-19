/**
 * scripts/run_migration_srole.mjs
 * Chạy migration SQL trực tiếp lên Supabase dùng service_role key.
 * Kết nối qua Transaction Pooler (JWT auth mode).
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
config({ path: resolve(rootDir, '.env.local') })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local')
  process.exit(1)
}

const PROJECT_REF = new URL(SUPABASE_URL).hostname.split('.')[0]
const migrationFile = resolve(rootDir, 'supabase/migrations/004_ui_section_split.sql')
const sql = readFileSync(migrationFile, 'utf8')

// Tách từng statement để chạy riêng biệt
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`\n🚀 Project: ${PROJECT_REF}`)
console.log(`📄 Migration: 004_ui_section_split.sql`)
console.log(`📊 Số statements: ${statements.length}\n`)

// Thử các pooler regions phổ biến cho Đông Nam Á
const REGIONS = ['ap-southeast-1', 'ap-east-1', 'us-east-1', 'eu-central-1']

async function tryPoolerRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`
  const { default: pg } = await import('pg')
  const client = new pg.Client({
    host,
    port: 5432,            // Session mode — hỗ trợ DDL
    database: 'postgres',
    user: `postgres.${PROJECT_REF}`,
    password: SERVICE_ROLE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  })

  try {
    await client.connect()
    return client
  } catch {
    return null
  }
}

async function main() {
  let client = null

  // Thử lần lượt từng region
  for (const region of REGIONS) {
    process.stdout.write(`🔌 Thử kết nối qua pooler [${region}]... `)
    client = await tryPoolerRegion(region)
    if (client) {
      console.log('✅ Kết nối thành công!')
      break
    }
    console.log('❌ Thất bại.')
  }

  // Nếu pooler không được, thử direct connection
  if (!client) {
    console.log('\n🔌 Thử kết nối direct (db.*.supabase.co:5432)...')
    const { default: pg } = await import('pg')
    client = new pg.Client({
      host: `db.${PROJECT_REF}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: SERVICE_ROLE_KEY,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    })
    try {
      await client.connect()
      console.log('✅ Direct connection thành công!')
    } catch (err) {
      console.error('❌ Không thể kết nối bằng bất kỳ phương thức nào.')
      console.error('   Chi tiết lỗi:', err.message)
      process.exit(1)
    }
  }

  // Chạy từng SQL statement
  console.log('\n📝 Đang thực thi migration statements...\n')
  let successCount = 0
  let skipCount = 0

  for (const stmt of statements) {
    const preview = stmt.replace(/\s+/g, ' ').substring(0, 60)
    try {
      await client.query(stmt)
      console.log(`  ✅ ${preview}...`)
      successCount++
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`  ⏭️  Đã tồn tại, bỏ qua: ${preview}...`)
        skipCount++
      } else {
        console.error(`  ❌ Lỗi: ${err.message}`)
        console.error(`     Statement: ${stmt.substring(0, 120)}`)
      }
    }
  }

  await client.end()
  console.log(`\n✅ Hoàn tất! ${successCount} thành công, ${skipCount} bỏ qua (đã tồn tại).`)
}

main().catch(err => {
  console.error('❌ Lỗi không mong muốn:', err.message)
  process.exit(1)
})
