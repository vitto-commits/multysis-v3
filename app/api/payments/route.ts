import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { transaction_id, amount, payment_method } = await req.json()

    const { data, error } = await supabase.from('ms_payments').insert({
      transaction_id,
      amount,
      payment_method: payment_method || 'cash',
      received_by: user.id,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('ms_transactions').update({ payment_status: 'paid' }).eq('id', transaction_id)

    return NextResponse.json({ success: true, payment: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
