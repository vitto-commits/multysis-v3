'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TableSkeleton } from '@/components/LoadingSkeleton'

export default function AdminAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('ms_addresses').select('*').order('barangay').then(({ data }) => {
      setAddresses(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = addresses.filter(a =>
    !search || a.barangay?.toLowerCase().includes(search.toLowerCase()) || a.street_address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Addresses</h1>
          <p className="text-gray-500 text-sm">Barangays and address directory</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search barangay..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={6} /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No addresses found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Barangay</th>
                  <th className="text-left px-5 py-3 font-medium">Municipality</th>
                  <th className="text-left px-5 py-3 font-medium">Province</th>
                  <th className="text-left px-5 py-3 font-medium">Postal Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{a.barangay || '—'}</td>
                    <td className="px-5 py-3 text-gray-700">{a.municipality || '—'}</td>
                    <td className="px-5 py-3 text-gray-700">{a.province || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{a.postal_code || '—'}</td>
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
