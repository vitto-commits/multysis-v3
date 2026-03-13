import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

// Admin client with service role for storage operations
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const transactionId = formData.get('transaction_id') as string | null
    const requirementName = formData.get('requirement_name') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!transactionId) {
      return NextResponse.json({ error: 'transaction_id is required' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF, JPG, and PNG are allowed.' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    // Sanitize filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const safeName = requirementName
      ? requirementName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + Date.now() + '.' + ext
      : `doc-${Date.now()}.${ext}`

    const filePath = `${user.id}/${transactionId}/${safeName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await adminSupabase.storage
      .from('requirements')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      file_path: data.path,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return NextResponse.json({ error: 'path is required' }, { status: 400 })
    }

    // Security: check if the user owns this file or is admin
    const pathParts = filePath.split('/')
    const fileUserId = pathParts[0]

    if (fileUserId !== user.id) {
      // Check if admin/staff
      const { data: profile } = await supabase
        .from('ms_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!profile || !['admin', 'bplo', 'staff'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const { data, error } = await adminSupabase.storage
      .from('requirements')
      .createSignedUrl(filePath, 60 * 60) // 1 hour

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
