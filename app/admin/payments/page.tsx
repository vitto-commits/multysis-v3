'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TableSkeleton } from '@/components/LoadingSkeleton'

const statusColors: Record<string, string> = {
  UNPAID: 'bg-red-100 text-red-700',
  PARTIAL: 'bg-amber-100 text-amber-700',
  PAID: 'bg-green-100 text-green-700',
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'history'>('pending')
  const [showModal, setShowModal] = useState(false)
  const [selectedTx, setSelectedTx] = useState<any>(null)
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'CASH', reference: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    // Fetch transactions with payment info
    const { data: txData } = await supabase
      .from('ms_transactions')
      .select('*, ms_services(name, default_amount), ms_profiles(first_name, last_name)')
      .order('created_at', { ascending: false })
    setTransactions(txData || [])

    // Fetch payment records
    const { data: payData } = await supabase
      .from('ms_payments')
      .select('*, ms_transactions(transaction_code, ms_services(name), ms_profiles(first_name, last_name))')
      .order('created_at', { ascending: false })
    setPayments(payData || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const pendingTx = transactions.filter(t => t.payment_status !== 'PAID' && t.ms_services?.default_amount > 0)
  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalPending = pendingTx.reduce((sum, t) => sum + ((t.ms_services?.default_amount || 0) - (t.payment_amount || 0)), 0)

  const handleRecordPayment = async () => {
    if (!selectedTx || !paymentForm.amount) return
    setSubmitting(true)
    const amount = parseFloat(paymentForm.amount)

    // Insert payment record
    await supabase.from('ms_payments').insert({
      transaction_id: selectedTx.id,
      amount,
      payment_method: paymentForm.method,
      reference_number: paymentForm.reference || null,
      notes: paymentForm.notes || null,
    })

    // Update transaction payment status
    const newTotal = (selectedTx.payment_amount || 0) + amount
    const required = selectedTx.ms_services?.default_amount || 0
    const newStatus = newTotal >= required ? 'PAID' : 'PARTIAL'

    await supabase.from('ms_transactions').update({
      payment_amount: newTotal,
      payment_status: newStatus,
    }).eq('id', selectedTx.id)

    setShowModal(false)
    setPaymentForm({ amount: '', method: 'CASH', reference: '', notes: '' })
    setSelectedTx(null)
    setSubmitting(false)
    fetchData()
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Payments & Collections</h1>
          <p className="text-sm text-gray-500 mt-1">Treasurer&apos;s Office — Process and track payments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Total Collected</div>
          <div className="text-2xl font-extrabold text-green-600">₱{totalCollected.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Pending Collection</div>
          <div className="text-2xl font-extrabold text-amber-600">₱{totalPending.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Payment Records</div>
          <div className="text-2xl font-extrabold text-primary">{payments.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'pending' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
          Pending Payments ({pendingTx.length})
        </button>
        <button onClick={() => setTab('history')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'history' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
          Payment History ({payments.length})
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={5} /></div>
        ) : tab === 'pending' ? (
          pendingTx.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p>No pending payments</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Transaction</th>
                    <th className="text-left px-5 py-3 font-medium">Citizen</th>
                    <th className="text-left px-5 py-3 font-medium">Service</th>
                    <th className="text-left px-5 py-3 font-medium">Amount Due</th>
                    <th className="text-left px-5 py-3 font-medium">Paid</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingTx.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-primary font-medium">{tx.transaction_code}</td>
                      <td className="px-5 py-3 text-gray-700">{tx.ms_profiles ? `${tx.ms_profiles.first_name} ${tx.ms_profiles.last_name}` : '—'}</td>
                      <td className="px-5 py-3 text-gray-700">{tx.ms_services?.name || '—'}</td>
                      <td className="px-5 py-3 font-medium">₱{(tx.ms_services?.default_amount || 0).toFixed(2)}</td>
                      <td className="px-5 py-3 text-gray-600">₱{(tx.payment_amount || 0).toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[tx.payment_status] || 'bg-gray-100 text-gray-700'}`}>
                          {tx.payment_status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => { setSelectedTx(tx); setPaymentForm({ ...paymentForm, amount: String((tx.ms_services?.default_amount || 0) - (tx.payment_amount || 0)) }); setShowModal(true) }}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium"
                        >
                          Record Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          payments.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No payment records yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                    <th className="text-left px-5 py-3 font-medium">Transaction</th>
                    <th className="text-left px-5 py-3 font-medium">Citizen</th>
                    <th className="text-left px-5 py-3 font-medium">Service</th>
                    <th className="text-left px-5 py-3 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 font-medium">Method</th>
                    <th className="text-left px-5 py-3 font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-500">{new Date(p.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="px-5 py-3 font-mono text-primary">{p.ms_transactions?.transaction_code || '—'}</td>
                      <td className="px-5 py-3 text-gray-700">{p.ms_transactions?.ms_profiles ? `${p.ms_transactions.ms_profiles.first_name} ${p.ms_transactions.ms_profiles.last_name}` : '—'}</td>
                      <td className="px-5 py-3 text-gray-700">{p.ms_transactions?.ms_services?.name || '—'}</td>
                      <td className="px-5 py-3 font-medium text-green-600">₱{p.amount?.toFixed(2)}</td>
                      <td className="px-5 py-3 text-gray-600">{p.payment_method}</td>
                      <td className="px-5 py-3 text-gray-500">{p.reference_number || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Payment Modal */}
      {showModal && selectedTx && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Record Payment</h3>
            <p className="text-sm text-gray-500 mb-4">
              {selectedTx.transaction_code} — {selectedTx.ms_services?.name}
            </p>

            <div className="space-y-3">
              <div>
                <label className="label">Amount (₱)</label>
                <input type="number" step="0.01" className="input" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
              </div>
              <div>
                <label className="label">Payment Method</label>
                <select className="input" value={paymentForm.method} onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })}>
                  <option value="CASH">Cash</option>
                  <option value="CHECK">Check</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="GCASH">GCash</option>
                  <option value="MAYA">Maya</option>
                </select>
              </div>
              <div>
                <label className="label">Reference Number (optional)</label>
                <input type="text" className="input" placeholder="OR #, check #, etc." value={paymentForm.reference} onChange={e => setPaymentForm({ ...paymentForm, reference: e.target.value })} />
              </div>
              <div>
                <label className="label">Notes (optional)</label>
                <textarea className="input" rows={2} value={paymentForm.notes} onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleRecordPayment} disabled={submitting || !paymentForm.amount} className="btn-primary flex-1 justify-center">
                {submitting ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
