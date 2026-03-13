'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatusBadge from '@/components/StatusBadge'
import { createClient } from '@/lib/supabase/client'

const statusSteps = ['pending', 'processing', 'for_pickup', 'completed']

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const [tx, setTx] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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

            {/* Application Data */}
            {tx.service_data && Object.keys(tx.service_data).length > 0 && (
              <div className="card">
                <h2 className="font-bold text-gray-900 mb-4">Application Details</h2>
                <dl className="space-y-3">
                  {Object.entries(tx.service_data).map(([k, v]) => (
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
