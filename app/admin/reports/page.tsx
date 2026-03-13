'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>({})
  const [serviceStats, setServiceStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchReports = async () => {
      const [txResult, pendingResult, completedResult, citizensResult, revenueResult, serviceResult] = await Promise.all([
        supabase.from('ms_transactions').select('id', { count: 'exact', head: true }),
        supabase.from('ms_transactions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('ms_transactions').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('ms_profiles').select('id', { count: 'exact', head: true }).eq('role', 'citizen'),
        supabase.from('ms_payments').select('amount'),
        supabase.from('ms_transactions').select('ms_services(name, code)'),
      ])
      const revenue = (revenueResult.data || []).reduce((s: number, p: any) => s + (p.amount || 0), 0)
      setStats({ total: txResult.count, pending: pendingResult.count, completed: completedResult.count, citizens: citizensResult.count, revenue })

      // Count by service
      const svcCount: Record<string, { name: string; count: number }> = {}
      ;(serviceResult.data || []).forEach((tx: any) => {
        const code = tx.ms_services?.code
        const name = tx.ms_services?.name
        if (code) {
          svcCount[code] = svcCount[code] || { name, count: 0 }
          svcCount[code].count++
        }
      })
      setServiceStats(Object.values(svcCount).sort((a, b) => b.count - a.count))
      setLoading(false)
    }
    fetchReports()
  }, [])

  const statCards = [
    { label: 'Total Transactions', value: stats.total, color: 'text-primary' },
    { label: 'Pending', value: stats.pending, color: 'text-warning' },
    { label: 'Completed', value: stats.completed, color: 'text-success' },
    { label: 'Citizens', value: stats.citizens, color: 'text-accent' },
    { label: 'Total Revenue', value: `₱${(stats.revenue || 0).toLocaleString()}`, color: 'text-success' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm">Summary statistics and analytics</p>
        </div>
        <button
          onClick={() => {
            const data = [['Metric', 'Value'], ...statCards.map(s => [s.label, String(s.value)])]
            const csv = data.map(r => r.join(',')).join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a'); a.href = url; a.download = 'multysis-report.csv'; a.click()
          }}
          className="btn-secondary text-sm"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[1,2,3,4,5].map(i => <div key={i} className="card h-24"></div>)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {statCards.map(s => (
              <div key={s.label} className="card text-center">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value ?? '—'}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Service breakdown */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Transactions by Service</h2>
            {serviceStats.length === 0 ? (
              <p className="text-gray-400 text-sm">No data</p>
            ) : (
              <div className="space-y-3">
                {serviceStats.slice(0, 10).map(svc => (
                  <div key={svc.name} className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-700 w-48 truncate">{svc.name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((svc.count / (stats.total || 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm font-bold text-gray-800 w-8 text-right">{svc.count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
