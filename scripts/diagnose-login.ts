/**
 * Script kiểm tra đăng nhập
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wdmjdayxaudravihloei.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWpkYXl4YXVkcmF2aWhsb2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODcwNTcsImV4cCI6MjA5NDA2MzA1N30.aSVQeg29lYSz83RwcFQKlhp5up6DY30odPi2sQTTEi0'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWpkYXl4YXVkcmF2aWhsb2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ4NzA1NywiZXhwIjoyMDk0MDYzMDU3fQ.6XYn0NVz0lshP4LjL8J5aTQNOHTmPIhhkPRxelAb940'

const EMAIL = 'admin@carpetsinter.vn'
const PASSWORD = 'admin123'

async function diagnose() {
  console.log('=== KIỂM TRA ĐĂNG NHẬP ===\n')

  // 1. Check user exists via admin API
  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  console.log('1. Kiểm tra user tồn tại...')
  const { data: listData, error: listError } = await adminClient.auth.admin.listUsers()
  if (listError) {
    console.error('   ✗ Lỗi list users:', listError.message)
  } else {
    console.log('   Tổng users:', listData.users.length)
    for (const u of listData.users) {
      console.log(`   - ${u.email} | confirmed: ${!!u.email_confirmed_at} | id: ${u.id}`)
    }
    
    const target = listData.users.find(u => u.email === EMAIL)
    if (!target) {
      console.log(`\n   ✗ Không tìm thấy user ${EMAIL}!`)
      console.log('   → Cần tạo mới...')
    } else {
      console.log(`\n   ✓ User ${EMAIL} tồn tại`)
      console.log(`     - Email confirmed: ${!!target.email_confirmed_at}`)
      console.log(`     - Created at: ${target.created_at}`)
      console.log(`     - Last sign in: ${target.last_sign_in_at || 'chưa bao giờ'}`)
      
      // If not confirmed, confirm it
      if (!target.email_confirmed_at) {
        console.log('\n   → Email chưa confirmed! Đang confirm...')
        const { error: updateErr } = await adminClient.auth.admin.updateUserById(target.id, {
          email_confirm: true,
        })
        if (updateErr) {
          console.error('   ✗ Lỗi confirm:', updateErr.message)
        } else {
          console.log('   ✓ Đã confirm email')
        }
      }
    }
  }

  // 2. Check profiles table
  console.log('\n2. Kiểm tra bảng profiles...')
  const { data: profiles, error: profError } = await adminClient
    .from('profiles')
    .select('*')
  
  if (profError) {
    console.error('   ✗ Lỗi đọc profiles:', profError.message)
  } else {
    console.log('   Profiles:', profiles.length)
    for (const p of profiles) {
      console.log(`   - ${p.email} | role: ${p.role} | id: ${p.id}`)
    }
  }

  // 3. Try signing in with anon key (same as the app does)
  console.log('\n3. Thử đăng nhập bằng anon key...')
  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  })

  if (signInError) {
    console.error('   ✗ Đăng nhập THẤT BẠI:', signInError.message)
    console.error('   Status:', signInError.status)
    
    // If invalid credentials, try resetting password
    if (signInError.message.includes('Invalid login credentials')) {
      console.log('\n   → Mật khẩu có thể sai. Đang reset mật khẩu...')
      const target = listData?.users?.find(u => u.email === EMAIL)
      if (target) {
        const { error: resetErr } = await adminClient.auth.admin.updateUserById(target.id, {
          password: PASSWORD,
          email_confirm: true,
        })
        if (resetErr) {
          console.error('   ✗ Lỗi reset:', resetErr.message)
        } else {
          console.log('   ✓ Đã reset mật khẩu thành "admin123"')
          
          // Try login again
          console.log('\n4. Thử đăng nhập lại...')
          const { data: retryData, error: retryError } = await anonClient.auth.signInWithPassword({
            email: EMAIL,
            password: PASSWORD,
          })
          if (retryError) {
            console.error('   ✗ Vẫn thất bại:', retryError.message)
          } else {
            console.log('   ✓ ĐĂNG NHẬP THÀNH CÔNG!')
            console.log('   User ID:', retryData.user?.id)
            console.log('   Session:', !!retryData.session)
          }
        }
      }
    }
  } else {
    console.log('   ✓ ĐĂNG NHẬP THÀNH CÔNG!')
    console.log('   User ID:', signInData.user?.id)
    console.log('   Session:', !!signInData.session)
  }

  console.log('\n=== KẾT THÚC KIỂM TRA ===')
}

diagnose().catch(console.error)
