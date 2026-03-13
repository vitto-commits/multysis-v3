'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import StatusBadge from '@/components/StatusBadge'

const statusOptions = ['pending', 'processing', 'for_pickup', 'completed', 'rejected']

export default function AdminTransactionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [tx, setTx] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null)
  const supabase = createClient()

  const fetchData = async () => {
    const [{ data: txData }, { data: notesData }] = await Promise.all([
      supabase.from('ms_transactions').select('*, ms_services(*), ms_profiles(*)').eq('id', id).single(),
      supabase.from('ms_transaction_notes').select('*').eq('transaction_id', id).order('created_at'),
    ])
    setTx(txData)
    setNotes(notesData || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  const updateStatus = async (status: string) => {
    setSaving(true)
    await supabase.from('ms_transactions').update({ status }).eq('id', id)
    await fetchData()
    setSaving(false)
  }

  const addNote = async () => {
    if (!newNote.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('ms_transaction_notes').insert({
      transaction_id: id,
      note: newNote,
      created_by: user?.id,
    })
    setNewNote('')
    await fetchData()
    setSaving(false)
  }

  const getSignedUrl = async (filePath: string) => {
    if (signedUrls[filePath]) {
      window.open(signedUrls[filePath], '_blank')
      return
    }
    setLoadingUrl(filePath)
    const res = await fetch(`/api/upload?path=${encodeURIComponent(filePath)}`)
    const data = await res.json()
    if (data.url) {
      setSignedUrls(prev => ({ ...prev, [filePath]: data.url }))
      window.open(data.url, '_blank')
    }
    setLoadingUrl(null)
  }

  const markDocReceived = async (reqName: string) => {
    setSaving(true)
    const currentReqs: any[] = tx.service_data?.requirements_status || []
    const updated = currentReqs.map((r: any) =>
      r.name === reqName ? { ...r, status: 'received', received_at: new Date().toISOString() } : r
    )
    await supabase.from('ms_transactions').update({
      service_data: { ...tx.service_data, requirements_status: updated },
    }).eq('id', id)
    await fetchData()
    setSaving(false)
  }

  const recordPayment = async () => {
    if (!paymentAmount) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('ms_payments').insert({
      transaction_id: id,
      amount: parseFloat(paymentAmount),
      payment_method: paymentMethod,
      received_by: user?.id,
    })
    await supabase.from('ms_transactions').update({ payment_status: 'paid' }).eq('id', id)
    setPaymentAmount('')
    await fetchData()
    setSaving(false)
  }

  if (loading) return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 card h-64"></div>
        <div className="card h-64"></div>
      </div>
    </div>
  )

  if (!tx) return (
    <div className="p-6 text-center">
      <div className="text-4xl mb-3">😕</div>
      <h2 className="text-xl font-bold">Transaction not found</h2>
      <Link href="/admin/transactions" className="btn-primary mt-4">Back</Link>
    </div>
  )

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/transactions" className="text-sm text-gray-500 hover:text-primary flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Transactions
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 font-mono">{tx.transaction_code}</h1>
        </div>
        <StatusBadge status={tx.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Details */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Service Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-gray-500 uppercase">Service</dt>
                <dd className="text-sm font-medium text-gray-800 mt-0.5">{tx.ms_services?.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Citizen</dt>
                <dd className="text-sm font-medium text-gray-800 mt-0.5">{tx.ms_profiles?.first_name} {tx.ms_profiles?.last_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Phone</dt>
                <dd className="text-sm font-medium text-gray-800 mt-0.5">{tx.ms_profiles?.phone || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Payment Status</dt>
                <dd className="mt-0.5"><StatusBadge status={tx.payment_status || 'unpaid'} /></dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Submitted</dt>
                <dd className="text-sm font-medium text-gray-800 mt-0.5">{new Date(tx.created_at).toLocaleDateString('en-PH', { dateStyle: 'long' })}</dd>
              </div>
            </dl>
            {tx.service_data && Object.keys(tx.service_data).filter(k => k !== 'requirements_status').length > 0 && (
              <>
                <hr className="my-4 border-gray-100" />
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Application Data</h3>
                <dl className="grid grid-cols-2 gap-3">
                  {Object.entries(tx.service_data).filter(([k]) => k !== 'requirements_status').map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-gray-500 capitalize">{k.replace(/_/g, ' ')}</dt>
                      <dd className="text-sm text-gray-800 mt-0.5">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            {/* Requirements Status */}
            {Array.isArray(tx.service_data?.requirements_status) && tx.service_data.requirements_status.length > 0 && (
              <>
                <hr className="my-4 border-gray-100" />
                <h3 className="font-semibold text-gray-700 mb-3 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Requirements Checklist
                </h3>
                <div className="space-y-2">
                  {tx.service_data.requirements_status.map((req: any, i: number) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${
                      req.status === 'uploaded' ? 'bg-sky-50 border-sky-200' :
                      req.status === 'received' ? 'bg-emerald-50 border-emerald-200' :
                      'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{req.name}</p>
                        {req.file_name && <p className="text-xs text-gray-500 truncate mt-0.5">{req.file_name}</p>}
                      </div>
                      {req.status === 'uploaded' && req.file_path && (
                        <button
                          onClick={() => getSignedUrl(req.file_path)}
                          disabled={loadingUrl === req.file_path}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-all flex-shrink-0"
                        >
                          {loadingUrl === req.file_path ? (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          View
                        </button>
                      )}
                      {req.status === 'will_bring' && (
                        <button
                          onClick={() => markDocReceived(req.name)}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all flex-shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Mark Received
                        </button>
                      )}
                      {req.status === 'received' && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Received
                        </span>
                      )}
                      {req.status === 'uploaded' && !req.file_path && (
                        <span className="text-xs font-semibold text-sky-600 flex-shrink-0">Uploaded</span>
                      )}
                      {req.status === 'will_bring' && (
                        <span className="text-xs text-amber-700 font-medium flex-shrink-0 mr-2">Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notes */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Notes & Messages</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-sm text-gray-400">No notes yet</p>
              ) : notes.map(note => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700">{note.note}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(note.created_at).toLocaleDateString('en-PH', { dateStyle: 'medium' })}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="input flex-1"
                placeholder="Add a note..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote()}
              />
              <button onClick={addNote} disabled={saving} className="btn-primary px-4 py-2">Add</button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Update Status */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3">Update Status</h3>
            <div className="space-y-2">
              {statusOptions.map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={saving || tx.status === s}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                    tx.status === s
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {s.replace('_', ' ')}
                  {tx.status === s && ' (current)'}
                </button>
              ))}
            </div>
          </div>

          {/* Record Payment */}
          {tx.ms_services?.requires_payment && tx.payment_status !== 'paid' && (
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3">Record Payment</h3>
              <div className="space-y-3">
                <div>
                  <label className="label">Amount (₱)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder={tx.ms_services?.default_amount?.toString() || '0'}
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Method</label>
                  <select className="input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="cash">Cash</option>
                    <option value="gcash">GCash</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <button onClick={recordPayment} disabled={saving || !paymentAmount} className="btn-primary w-full justify-center">
                  Record Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
