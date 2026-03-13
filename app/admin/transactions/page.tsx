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
          <div className="p-12 text-center text-gray-400">No transactions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Ref Code</th>
                  <th className="text-left px-5 py-3 font-medium">Citizen</th>
                  <th className="text-left px-5 py-3 font-medium">Service</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Payment</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-primary text-xs">{tx.transaction_code}</td>
                    <td className="px-5 py-3 text-gray-700">
                      {tx.ms_profiles ? `${tx.ms_profiles.first_name} ${tx.ms_profiles.last_name}` : '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-700 max-w-[180px] truncate">{tx.ms_services?.name || '—'}</td>
                    <td className="px-5 py-3"><StatusBadge status={tx.status} /></td>
                    <td className="px-5 py-3"><StatusBadge status={tx.payment_status || 'unpaid'} /></td>
                    <td className="px-5 py-3 text-gray-500">{new Date(tx.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: '2-digit' })}</td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/transactions/${tx.id}`} className="text-primary hover:underline text-xs font-medium">View</Link>
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
