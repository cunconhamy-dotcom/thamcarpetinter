/**
 * scripts/push_migration.mjs
 * Script thực thi file migration SQL trực tiếp lên Supabase qua Management API.
 * Yêu cầu: SUPABASE_ACCESS_TOKEN trong .env.local
 *
 * Lấy token tại: https://supabase.com/dashboard/account/tokens
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Load .env.local
config({ path: resolve(rootDir, '.env.local') })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD

if (!SUPABASE_URL) {
  console.error('❌ Thiếu VITE_SUPABASE_URL trong .env.local')
  process.exit(1)
}

// Extract project ref from URL (e.g. https://wdmjdayxaudravihloei.supabase.co → wdmjdayxaudravihloei)
const PROJECT_REF = new URL(SUPABASE_URL).hostname.split('.')[0]

// Đọc file migration
const migrationFile = resolve(rootDir, 'supabase/migrations/004_ui_section_split.sql')
const sql = readFileSync(migrationFile, 'utf8')

console.log(`\n🚀 Đang push migration lên project: ${PROJECT_REF}`)
console.log(`📄 File: supabase/migrations/004_ui_section_split.sql\n`)

async function runMigration() {
  let response

  // --- Cách 1: Dùng Management API (cần SUPABASE_ACCESS_TOKEN) ---
  if (ACCESS_TOKEN) {
    console.log('🔑 Dùng Management API với Access Token...')
    response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    })

    if (response.ok) {
      console.log('✅ Migration thành công via Management API!')
      return
    }

    const errText = await response.text()
    console.error(`⚠️  Management API lỗi (${response.status}): ${errText}`)
  } else {
    console.log('ℹ️  Không tìm thấy SUPABASE_ACCESS_TOKEN, bỏ qua Management API.')
  }

  // --- Cách 2: Dùng DB Password trực tiếp qua pg ---
  if (DB_PASSWORD) {
    console.log('🔑 Thử kết nối trực tiếp qua PostgreSQL...')
    const { default: pg } = await import('pg')
    const { Client } = pg

    const client = new Client({
      host: `db.${PROJECT_REF}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
    })

    try {
      await client.connect()
      await client.query(sql)
      await client.end()
      console.log('✅ Migration thành công via PostgreSQL!')
    } catch (err) {
      console.error('❌ Lỗi kết nối PostgreSQL:', err.message)
      process.exit(1)
    }
    return
  }

  // --- Không có token nào ---
  console.error('\n❌ Cần ít nhất 1 trong 2 thông tin sau trong .env.local:\n')
  console.error('   SUPABASE_ACCESS_TOKEN=<token cá nhân từ https://supabase.com/dashboard/account/tokens>')
  console.error('   SUPABASE_DB_PASSWORD=<mật khẩu DB từ Supabase > Project Settings > Database>\n')
  process.exit(1)
}

runMigration().catch((err) => {
  console.error('❌ Lỗi không mong muốn:', err)
  process.exit(1)
})
