import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdmjdayxaudravihloei.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWpkYXl4YXVkcmF2aWhsb2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ4NzA1NywiZXhwIjoyMDk0MDYzMDU3fQ.6XYn0NVz0lshP4LjL8J5aTQNOHTmPIhhkPRxelAb940'

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'admin@carpetsinter.vn'
  const password = 'AdminPassword123!'
  
  console.log(`Creating user: ${email}...`)
  
  // Create user using the admin API
  const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: 'Quản Trị Viên',
      role: 'admin' // The trigger might catch this, but let's be sure
    }
  })

  if (createError) {
    if (createError.message.includes('already exists')) {
      console.log('User already exists, updating role...')
      // If user exists, fetch them
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = users.users.find(u => u.email === email)
      
      if (existingUser) {
        // Update their profile role to admin
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', existingUser.id)
          
        if (updateError) {
          console.error('Error updating profile role:', updateError.message)
        } else {
          console.log('Successfully updated existing user to admin.')
        }
      }
    } else {
      console.error('Error creating user:', createError.message)
    }
    return
  }

  if (user) {
    console.log('User created successfully.')
    // Update profile role to 'admin' (since our trigger defaults to 'viewer' if not caught)
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.user.id)
      
    if (updateError) {
      console.error('Error updating role in profiles table:', updateError.message)
    } else {
      console.log('Profile successfully set as Admin.')
    }
  }
}

createAdminUser()
