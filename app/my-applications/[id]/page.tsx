'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatusBadge from '@/components/StatusBadge'
import { createClient } from '@/lib/supabase/client'

const statusSteps = ['pending', 'processing', 'for_pickup', 'completed']

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const [tx, setTx] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('ms_transactions')
        .select('*, ms_services(*)')
        .eq('id', id)
        .single()
      setTx(data)

      const { data: notesData } = await supabase
        .from('ms_transaction_notes')
        .select('*')
        .eq('transaction_id', id)
        .order('created_at', { ascending: true })
      setNotes(notesData || [])
      setLoading(false)
    }
    fetchData()
  }, [id])

  const uploadMissingDoc = async (reqIdx: number, file: File) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowed.includes(file.type)) { setUploadError('Only PDF, JPG, PNG allowed'); return }
    if (file.size > 10 * 1024 * 1024) { setUploadError('File must be under 10MB'); return }
    setUploadError(null)
    setUploadingIdx(reqIdx)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('transaction_id', id as string)
    fd.append('requirement_name', tx.service_data?.requirements_status?.[reqIdx]?.name || 'document')

    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()

    if (!res.ok || data.error) {
      setUploadError(data.error || 'Upload failed')
      setUploadingIdx(null)
      return
    }

    // Update transaction's requirements_status
    const currentReqs: any[] = tx.service_data?.requirements_status || []
    const updated = currentReqs.map((r: any, i: number) =>
      i === reqIdx ? { ...r, status: 'uploaded', file_path: data.file_path, file_name: file.name } : r
    )
    await supabase.from('ms_transactions').update({
      service_data: { ...tx.service_data, requirements_status: updated },
    }).eq('id', id)

    // Refresh
    const { data: newTx } = await supabase.from('ms_transactions').select('*, ms_services(*)').eq('id', id).single()
    setTx(newTx)
    setUploadingIdx(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card h-64"></div>
            <div className="card h-64"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!tx) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold">Application not found</h2>
          <Link href="/my-applications" className="btn-primary mt-4">Back to My Applications</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const currentStep = statusSteps.indexOf(tx.status)

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/my-applications" className="hover:text-primary">My Applications</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-800 font-medium font-mono">{tx.transaction_code}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{tx.ms_services?.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">Transaction Code: <span className="font-mono font-medium text-gray-800">{tx.transaction_code}</span></p>
                </div>
                <StatusBadge status={tx.status} />
              </div>

              {/* Progress Steps */}
              {tx.status !== 'rejected' && tx.status !== 'cancelled' && (
                <div className="mt-6">
                  <div className="flex items-center">
                    {statusSteps.map((step, i) => (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                            i < currentStep ? 'bg-success border-success text-white' :
                            i === currentStep ? 'bg-primary border-primary text-white' :
                            'bg-white border-gray-200 text-gray-400'
                          }`}>
                            {i < currentStep ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : i + 1}
                          </div>
                          <div className={`text-xs mt-1.5 capitalize text-center w-20 ${i <= currentStep ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                            {step.replace('_', ' ')}
                          </div>
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < currentStep ? 'bg-success' : 'bg-gray-200'}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Requirements Status */}
            {Array.isArray(tx.service_data?.requirements_status) && tx.service_data.requirements_status.length > 0 && (
              <div className="card">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Requirements Status
                </h2>
                {uploadError && (
                  <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {uploadError}
                  </div>
                )}
                <div className="space-y-3">
                  {tx.service_data.requirements_status.map((req: any, i: number) => (
                    <div key={i} className={`rounded-xl border p-4 ${
                      req.status === 'uploaded' ? 'bg-sky-50 border-sky-200' :
                      req.status === 'received' ? 'bg-emerald-50 border-emerald-200' :
                      'bg-amber-50 border-amber-100'
                    }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{req.name}</p>
                          {req.file_name && <p className="text-xs text-gray-500 mt-0.5 truncate">{req.file_name}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {req.status === 'uploaded' && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-full">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                              </svg>
                              Uploaded
                            </span>
                          )}
                          {req.status === 'received' && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Received
                            </span>
                          )}
                          {req.status === 'will_bring' && (
                            <>
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Bring to office
                              </span>
                              <button
                                onClick={() => fileInputRefs.current[i]?.click()}
                                disabled={uploadingIdx === i}
                                className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-white border border-sky-300 px-2.5 py-1 rounded-full hover:bg-sky-50 transition-all"
                              >
                                {uploadingIdx === i ? (
                                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                  </svg>
                                )}
                                Upload instead
                              </button>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                ref={el => { fileInputRefs.current[i] = el }}
                                onChange={e => e.target.files?.[0] && uploadMissingDoc(i, e.target.files[0])}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Data */}
            {tx.service_data && Object.keys(tx.service_data).filter((k: string) => k !== 'requirements_status').length > 0 && (
              <div className="card">
                <h2 className="font-bold text-gray-900 mb-4">Application Details</h2>
                <dl className="space-y-3">
                  {Object.entries(tx.service_data).filter(([k]) => k !== 'requirements_status').map(([k, v]) => (
                    <div key={k} className="flex gap-4">
                      <dt className="text-sm text-gray-500 capitalize w-1/3">{k.replace(/_/g, ' ')}</dt>
                      <dd className="text-sm font-medium text-gray-800 flex-1">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Notes */}
            {notes.length > 0 && (
              <div className="card">
                <h2 className="font-bold text-gray-900 mb-4">Messages & Updates</h2>
                <div className="space-y-3">
                  {notes.map(note => (
                    <div key={note.id} className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-700">{note.note}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(note.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Application Info</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-500 uppercase">Status</dt>
                  <dd className="mt-1"><StatusBadge status={tx.status} /></dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase">Payment</dt>
                  <dd className="mt-1"><StatusBadge status={tx.payment_status || 'unpaid'} /></dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase">Submitted</dt>
                  <dd className="text-sm font-medium text-gray-800 mt-0.5">
                    {new Date(tx.created_at).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </dd>
                </div>
                {tx.ms_services?.requires_payment && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase">Fee</dt>
                    <dd className="text-sm font-medium text-gray-800 mt-0.5">₱{tx.ms_services.default_amount?.toFixed(2)}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="card bg-blue-50 border-blue-100">
              <h3 className="font-bold text-primary text-sm mb-2">Need Help?</h3>
              <p className="text-xs text-gray-600 mb-2">For inquiries about your application, contact the City Hall.</p>
              <a href="tel:055-560-9999" className="text-sm font-medium text-primary hover:underline">(055) 560-9999</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
