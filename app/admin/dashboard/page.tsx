'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import StatusBadge from '@/components/StatusBadge'

function StatCard({ label, value, icon, color, trend }: any) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        {trend && <span className="text-xs font-medium text-success bg-green-50 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, citizens: 0, revenue: 0 })
  const [recent, setRecent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const [txResult, pendingResult, citizensResult, revenueResult, recentResult] = await Promise.all([
        supabase.from('ms_transactions').select('id', { count: 'exact', head: true }),
        supabase.from('ms_transactions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('ms_profiles').select('id', { count: 'exact', head: true }).eq('role', 'citizen'),
        supabase.from('ms_payments').select('amount'),
        supabase.from('ms_transactions').select('*, ms_services(name), ms_profiles(first_name, last_name)').order('created_at', { ascending: false }).limit(8),
      ])
      const revenue = (revenueResult.data || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
      setStats({
        total: txResult.count || 0,
        pending: pendingResult.count || 0,
        citizens: citizensResult.count || 0,
        revenue,
      })
      setRecent(recentResult.data || [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">City of Borongan — Service Management Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Transactions" value={loading ? '—' : stats.total} icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" color="bg-primary" />
        <StatCard label="Pending Applications" value={loading ? '—' : stats.pending} icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="bg-warning" trend={stats.pending > 0 ? `${stats.pending} to process` : undefined} />
        <StatCard label="Registered Citizens" value={loading ? '—' : stats.citizens} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="bg-accent" />
        <StatCard label="Total Revenue" value={loading ? '—' : `₱${stats.revenue.toLocaleString()}`} icon="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" color="bg-success" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: '/admin/transactions', label: 'View Transactions', icon: '📋' },
          { href: '/admin/citizens', label: 'Citizens List', icon: '👥' },
          { href: '/admin/appointments', label: 'Appointments', icon: '📅' },
          { href: '/admin/reports', label: 'Reports', icon: '📊' },
        ].map(action => (
          <Link key={action.href} href={action.href} className="card text-center hover:shadow-md hover:-translate-y-0.5 transition-all p-4">
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium text-gray-700">{action.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Transactions</h2>
          <Link href="/admin/transactions" className="text-sm text-primary hover:underline font-medium">View all</Link>
        </div>
        {loading ? (
          <div className="p-6 animate-pulse space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg"></div>)}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No transactions yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">Transaction</th>
                  <th className="text-left px-6 py-3 font-medium">Citizen</th>
                  <th className="text-left px-6 py-3 font-medium">Service</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-mono font-medium text-primary">
                      <Link href={`/admin/transactions/${tx.id}`} className="hover:underline">{tx.transaction_code}</Link>
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {tx.ms_profiles ? `${tx.ms_profiles.first_name} ${tx.ms_profiles.last_name}` : '—'}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{tx.ms_services?.name || '—'}</td>
                    <td className="px-6 py-3"><StatusBadge status={tx.status} /></td>
                    <td className="px-6 py-3 text-gray-500">{new Date(tx.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</td>
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
