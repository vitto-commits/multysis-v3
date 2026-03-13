import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function generateTransactionCode(): string {
  const prefix = 'TXN'
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 900000) + 100000
  return `${prefix}-${year}-${random}`
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { service_id, service_data, requirements_status } = await req.json()

    if (!service_id) {
      return NextResponse.json({ error: 'service_id is required' }, { status: 400 })
    }

    const transaction_code = generateTransactionCode()

    const { data, error } = await supabase.from('ms_transactions').insert({
      user_id: user.id,
      service_id,
      transaction_code,
      status: 'pending',
      payment_status: 'unpaid',
      service_data: { ...(service_data || {}), requirements_status: requirements_status || [] },
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, transaction_code: data.transaction_code, id: data.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
