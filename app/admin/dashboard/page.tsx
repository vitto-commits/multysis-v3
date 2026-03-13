'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import StatusBadge from '@/components/StatusBadge'

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function StatCard({ label, value, icon, gradient, trend, trendColor = 'text-success' }: any) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white ${gradient} shadow-card`}>
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 top-8 w-12 h-12 rounded-full bg-white/8" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
          {trend && (
            <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <div className="text-3xl font-extrabold mb-1 tracking-tight">{value}</div>
        <div className="text-white/75 text-sm font-medium">{label}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, citizens: 0, revenue: 0 })
  const [recent, setRecent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adminName, setAdminName] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('ms_profiles').select('first_name').eq('user_id', user.id).single()
        if (profile) setAdminName(profile.first_name || '')
      }

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
    <div className="p-6 lg:p-8 max-w-full">
      {/* Header with greeting */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {getTimeGreeting()}{adminName ? `, ${adminName}` : ''}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            City of Borongan — Service Management Overview
            <span className="ml-2 text-gray-400">
              · {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </p>
        </div>
        <Link href="/admin/transactions?status=pending" className="hidden sm:inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          {loading ? '—' : stats.pending} Pending
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Transactions"
          value={loading ? '—' : stats.total.toLocaleString()}
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          gradient="bg-gradient-to-br from-primary to-blue-700"
        />
        <StatCard
          label="Pending Applications"
          value={loading ? '—' : stats.pending}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          trend={stats.pending > 0 ? 'Needs attention' : undefined}
        />
        <StatCard
          label="Registered Citizens"
          value={loading ? '—' : stats.citizens.toLocaleString()}
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          gradient="bg-gradient-to-br from-accent to-sky-600"
        />
        <StatCard
          label="Total Revenue"
          value={loading ? '—' : `₱${stats.revenue.toLocaleString()}`}
          icon="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          gradient="bg-gradient-to-br from-emerald-500 to-green-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: '/admin/transactions', label: 'View Transactions', path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-blue-50 text-primary' },
          { href: '/admin/citizens', label: 'Citizens List', path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'bg-sky-50 text-sky-600' },
          { href: '/admin/appointments', label: 'Appointments', path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-purple-50 text-purple-600' },
          { href: '/admin/reports', label: 'Reports', path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'bg-emerald-50 text-emerald-600' },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            className="card text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-4 group"
          >
            <div className={`w-10 h-10 mx-auto mb-2.5 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={action.path} />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700">{action.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Recent Transactions</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest 8 submitted applications</p>
          </div>
          <Link href="/admin/transactions" className="text-sm text-primary hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors">
            View all
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-2.5">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 shimmer rounded w-24 flex-shrink-0" />
                <div className="h-4 shimmer rounded w-32 flex-shrink-0" />
                <div className="h-4 shimmer rounded flex-1" />
                <div className="h-5 shimmer rounded-full w-16 flex-shrink-0" />
                <div className="h-4 shimmer rounded w-16 flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No transactions yet</p>
            <p className="text-gray-300 text-sm mt-1">Applications will appear here once submitted</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Citizen</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(tx => (
                  <tr key={tx.id}>
                    <td className="font-mono font-semibold text-primary">
                      <Link href={`/admin/transactions/${tx.id}`} className="hover:underline">
                        {tx.transaction_code}
                      </Link>
                    </td>
                    <td className="text-gray-700 font-medium">
                      {tx.ms_profiles ? `${tx.ms_profiles.first_name} ${tx.ms_profiles.last_name}` : '—'}
                    </td>
                    <td className="text-gray-600">{tx.ms_services?.name || '—'}</td>
                    <td><StatusBadge status={tx.status} /></td>
                    <td className="text-gray-400 text-xs">
                      {new Date(tx.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
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
