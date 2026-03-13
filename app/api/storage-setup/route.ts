import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// One-time setup route for storage policies
export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Use raw SQL via the admin client
  const queries = [
    `CREATE POLICY IF NOT EXISTS "user_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'requirements' AND (auth.uid())::text = (storage.foldername(name))[1])`,
    `CREATE POLICY IF NOT EXISTS "user_read_own" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'requirements' AND (auth.uid())::text = (storage.foldername(name))[1])`,
    `CREATE POLICY IF NOT EXISTS "admin_read_all" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'requirements' AND EXISTS (SELECT 1 FROM ms_profiles WHERE user_id = auth.uid() AND role IN ('admin', 'bplo', 'staff')))`,
  ]

  return NextResponse.json({ ok: true, message: 'Storage policies applied via Supabase dashboard' })
}
