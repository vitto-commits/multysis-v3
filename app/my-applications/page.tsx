'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatusBadge from '@/components/StatusBadge'
import { createClient } from '@/lib/supabase/client'
import { TableSkeleton } from '@/components/LoadingSkeleton'

export default function MyApplicationsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('ms_transactions')
        .select('*, ms_services(name, category, code)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setTransactions(data || [])
      setLoading(false)
    }
    fetchTransactions()
  }, [])

  const statuses = ['all', 'pending', 'processing', 'for_pickup', 'completed', 'rejected']

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.status === filter)

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-2">My Applications</h1>
          <p className="text-blue-100">Track the status of your government service applications</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                filter === s ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/30'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
              {s === 'all' ? ` (${transactions.length})` : ` (${transactions.filter(t => t.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No applications found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' ? "You haven't submitted any applications yet." : `No ${filter.replace('_', ' ')} applications.`}
            </p>
            <Link href="/services" className="btn-primary">Browse Services</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(tx => (
              <Link
                key={tx.id}
                href={`/my-applications/${tx.id}`}
                className="card flex items-center justify-between hover:shadow-md transition-all hover:-translate-y-0.5 gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{tx.ms_services?.name || 'Unknown Service'}</div>
                    <div className="text-sm text-gray-500">
                      Ref: <span className="font-mono font-medium">{tx.transaction_code}</span>
                      {' · '}
                      {new Date(tx.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={tx.status} />
                  {tx.payment_status && <StatusBadge status={tx.payment_status} />}
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
