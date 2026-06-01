/**
 * Script tạo tài khoản Admin trên Supabase (dùng Service Role Key)
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wdmjdayxaudravihloei.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWpkYXl4YXVkcmF2aWhsb2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ4NzA1NywiZXhwIjoyMDk0MDYzMDU3fQ.6XYn0NVz0lshP4LjL8J5aTQNOHTmPIhhkPRxelAb940'

const ADMIN_EMAIL = 'admin@carpetsinter.vn'
const ADMIN_PASSWORD = 'admin123'

async function createAdmin() {
  console.log('=== Tạo tài khoản Admin cho Carpets Inter ===\n')

  // Service role client bypasses RLS
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Step 1: Create user via Admin API (auto-confirmed, no email verification needed)
  console.log(`1. Tạo user: ${ADMIN_EMAIL}`)
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Admin Carpets Inter', role: 'admin' },
  })

  if (createError) {
    if (createError.message?.includes('already been registered') || createError.message?.includes('already exists')) {
      console.log('   → Tài khoản đã tồn tại. Tiếp tục cập nhật role...')
      
      // List users to find the existing one
      const { data: listData } = await supabase.auth.admin.listUsers()
      const existingUser = listData?.users?.find(u => u.email === ADMIN_EMAIL)
      
      if (existingUser) {
        console.log('   ✓ Tìm thấy user:', existingUser.id)
        
        // Update role in profiles table
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: existingUser.id,
            email: ADMIN_EMAIL,
            full_name: 'Admin Carpets Inter',
            role: 'admin',
          }, { onConflict: 'id' })

        if (updateError) {
          console.error('   ✗ Lỗi cập nhật profile:', updateError.message)
        } else {
          console.log('   ✓ Đã cập nhật role = admin')
        }
      }
    } else {
      console.error('   ✗ Lỗi tạo user:', createError.message)
      return
    }
  } else {
    const userId = userData.user?.id
    console.log('   ✓ Tạo user thành công! ID:', userId)

    // Wait for trigger to create profile row
    await new Promise(r => setTimeout(r, 1500))

    // Step 2: Update profile role to admin
    console.log('\n2. Cập nhật role thành admin...')
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: ADMIN_EMAIL,
        full_name: 'Admin Carpets Inter',
        role: 'admin',
      }, { onConflict: 'id' })

    if (updateError) {
      console.error('   ✗ Lỗi cập nhật profile:', updateError.message)
    } else {
      console.log('   ✓ Đã cập nhật role = admin')
    }
  }

  console.log('\n=== HOÀN TẤT ===')
  console.log(`Email:    ${ADMIN_EMAIL}`)
  console.log(`Password: ${ADMIN_PASSWORD}`)
  console.log(`Truy cập: http://localhost:5173/admin`)
}

createAdmin().catch(console.error)
