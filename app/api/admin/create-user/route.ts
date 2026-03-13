import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Verify the caller is a master admin
  const cookieStore = cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabaseAuth.from('ms_profiles').select('role').eq('user_id', user.id).single()
  if (!callerProfile || callerProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Only Master Admin can create accounts' }, { status: 403 })
  }

  const body = await request.json()
  const { email, password, firstName, lastName, phone, role } = body

  if (!email || !password || !firstName || !lastName || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const validRoles = ['admin', 'bplo', 'assessor', 'treasurer', 'staff', 'citizen']
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // Use service role key to create user
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Create auth user
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 })
  }

  // Update the profile (auto-created by trigger) with role and name
  const { error: profileError } = await supabaseAdmin
    .from('ms_profiles')
    .update({
      role,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
    })
    .eq('user_id', newUser.user.id)

  if (profileError) {
    // Profile might not exist yet (no trigger), try insert
    await supabaseAdmin.from('ms_profiles').insert({
      user_id: newUser.user.id,
      role,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      is_active: true,
    })
  }

  return NextResponse.json({
    success: true,
    user: { id: newUser.user.id, email, role, firstName, lastName },
  })
}
