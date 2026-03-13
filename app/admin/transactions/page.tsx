'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import StatusBadge from '@/components/StatusBadge'
import { TableSkeleton } from '@/components/LoadingSkeleton'

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const fetchTransactions = async () => {
    let query = supabase
      .from('ms_transactions')
      .select('*, ms_services(name, category), ms_profiles(first_name, last_name, phone)')
      .order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setTransactions(data || [])
    setLoading(false)
  }

  useEffect(() => { setLoading(true); fetchTransactions() }, [filter])

  const filtered = transactions.filter(tx =>
    !search ||
    tx.transaction_code?.toLowerCase().includes(search.toLowerCase()) ||
    tx.ms_profiles?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    tx.ms_profiles?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
    tx.ms_services?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const statuses = ['all', 'pending', 'processing', 'for_pickup', 'completed', 'rejected']

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all service applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filter === s ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={6} /></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No transactions found</p>
            <p className="text-gray-300 text-sm mt-1">Try changing your filter or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref Code</th>
                  <th>Citizen</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td className="font-mono font-semibold text-primary text-xs">{tx.transaction_code}</td>
                    <td className="text-gray-700 font-medium">
                      {tx.ms_profiles ? `${tx.ms_profiles.first_name} ${tx.ms_profiles.last_name}` : '—'}
                    </td>
                    <td className="text-gray-600 max-w-[180px] truncate">{tx.ms_services?.name || '—'}</td>
                    <td><StatusBadge status={tx.status} /></td>
                    <td><StatusBadge status={tx.payment_status || 'unpaid'} /></td>
                    <td className="text-gray-400 text-xs">{new Date(tx.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: '2-digit' })}</td>
                    <td>
                      <Link href={`/admin/transactions/${tx.id}`} className="text-primary hover:text-blue-800 text-xs font-semibold transition-colors">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
