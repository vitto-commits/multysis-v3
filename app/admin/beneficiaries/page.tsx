'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import StatusBadge from '@/components/StatusBadge'
import { TableSkeleton } from '@/components/LoadingSkeleton'

const typeLabels: Record<string, string> = {
  STUDENT: 'Student Allowance',
  SENIOR_CITIZEN: 'Senior Citizen',
  PWD: 'PWD',
  SOLO_PARENT: 'Solo Parent',
}

const typeColors: Record<string, string> = {
  STUDENT: 'bg-blue-100 text-blue-700',
  SENIOR_CITIZEN: 'bg-amber-100 text-amber-700',
  PWD: 'bg-purple-100 text-purple-700',
  SOLO_PARENT: 'bg-pink-100 text-pink-700',
}

export default function AdminBeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterBarangay, setFilterBarangay] = useState('ALL')
  const [selected, setSelected] = useState<any>(null)
  const [page, setPage] = useState(1)
  const perPage = 50
  const supabase = createClient()

  useEffect(() => {
    const fetchAll = async () => {
      let all: any[] = []
      let from = 0
      const pageSize = 1000
      while (true) {
        const { data } = await supabase.from('ms_beneficiaries')
          .select('*, ms_beneficiary_programs(program_id, ms_government_programs(name))')
          .order('created_at', { ascending: false })
          .range(from, from + pageSize - 1)
        if (!data || data.length === 0) break
        all = all.concat(data)
        if (data.length < pageSize) break
        from += pageSize
      }
      setBeneficiaries(all)
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Get unique barangays
  const barangays = useMemo(() => {
    const set = new Set<string>()
    beneficiaries.forEach(b => {
      const brgy = b.extra_data?.barangay
      if (brgy) set.add(brgy)
    })
    return Array.from(set).sort()
  }, [beneficiaries])

  // Filter
  const filtered = useMemo(() => {
    return beneficiaries.filter(b => {
      const name = `${b.extra_data?.first_name || ''} ${b.extra_data?.middle_name || ''} ${b.extra_data?.last_name || ''}`.toLowerCase()
      const matchSearch = !search || name.includes(search.toLowerCase()) || (b.extra_data?.barangay || '').toLowerCase().includes(search.toLowerCase())
      const matchType = filterType === 'ALL' || b.beneficiary_type === filterType
      const matchBarangay = filterBarangay === 'ALL' || b.extra_data?.barangay === filterBarangay
      return matchSearch && matchType && matchBarangay
    })
  }, [beneficiaries, search, filterType, filterBarangay])

  // Stats
  const stats = useMemo(() => {
    const byType: Record<string, number> = {}
    beneficiaries.forEach(b => {
      byType[b.beneficiary_type] = (byType[b.beneficiary_type] || 0) + 1
    })
    return byType
  }, [beneficiaries])

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Program Beneficiaries</h1>
        <p className="text-gray-500 text-sm">CSDO — Manage program beneficiaries and allowances</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Total Beneficiaries</div>
          <div className="text-2xl font-extrabold text-primary">{beneficiaries.length.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Student Allowance</div>
          <div className="text-2xl font-extrabold text-blue-600">{(stats.STUDENT || 0).toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Senior Citizen</div>
          <div className="text-2xl font-extrabold text-amber-600">{(stats.SENIOR_CITIZEN || 0).toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">PWD</div>
          <div className="text-2xl font-extrabold text-purple-600">{(stats.PWD || 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            className="input"
            placeholder="Search by name or barangay..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select className="input w-auto" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }}>
          <option value="ALL">All Programs</option>
          <option value="STUDENT">Student Allowance</option>
          <option value="SENIOR_CITIZEN">Senior Citizen</option>
          <option value="PWD">PWD</option>
          <option value="SOLO_PARENT">Solo Parent</option>
        </select>
        <select className="input w-auto" value={filterBarangay} onChange={e => { setFilterBarangay(e.target.value); setPage(1) }}>
          <option value="ALL">All Barangays</option>
          {barangays.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500 mb-2">
        Showing {filtered.length.toLocaleString()} of {beneficiaries.length.toLocaleString()} beneficiaries
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p>No beneficiaries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Barangay</th>
                  <th className="text-left px-5 py-3 font-medium">Sex</th>
                  <th className="text-left px-5 py-3 font-medium">Program</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.slice((page - 1) * perPage, page * perPage).map(b => {
                  const d = b.extra_data || {}
                  const fullName = [d.first_name, d.middle_name, d.last_name, d.extension_name].filter(Boolean).join(' ')
                  return (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {d.first_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{fullName}</div>
                            <div className="text-xs text-gray-400">{d.phone ? `0${d.phone}` : '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-700">{d.barangay || '—'}</td>
                      <td className="px-5 py-3 text-gray-600">{d.sex || '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[b.beneficiary_type] || 'bg-gray-100 text-gray-700'}`}>
                          {typeLabels[b.beneficiary_type] || b.beneficiary_type}
                        </span>
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setSelected(b)}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length > perPage && (
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length.toLocaleString()}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-xs font-medium text-gray-600">
                    Page {page} of {Math.ceil(filtered.length / perPage)}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / perPage), p + 1))}
                    disabled={page >= Math.ceil(filtered.length / perPage)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Beneficiary Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {(() => {
              const d = selected.extra_data || {}
              const fullName = [d.first_name, d.middle_name, d.last_name, d.extension_name].filter(Boolean).join(' ')
              return (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                      {d.first_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{fullName}</div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[selected.beneficiary_type] || 'bg-gray-100 text-gray-700'}`}>
                        {typeLabels[selected.beneficiary_type] || selected.beneficiary_type}
                      </span>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Birthdate:</span> <span className="font-medium">{d.birthdate || '—'}</span></div>
                      <div><span className="text-gray-500">Sex:</span> <span className="font-medium">{d.sex || '—'}</span></div>
                      <div><span className="text-gray-500">Civil Status:</span> <span className="font-medium">{d.civil_status || '—'}</span></div>
                      <div><span className="text-gray-500">Profession:</span> <span className="font-medium">{d.profession || '—'}</span></div>
                      {d.place_of_birth && <div className="col-span-2"><span className="text-gray-500">Place of Birth:</span> <span className="font-medium">{d.place_of_birth}</span></div>}
                      {d.spouse_name && <div className="col-span-2"><span className="text-gray-500">Spouse:</span> <span className="font-medium">{d.spouse_name}</span></div>}
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Contact</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{d.phone ? `0${d.phone}` : '—'}</span></div>
                      {d.id_type && <div><span className="text-gray-500">ID Type:</span> <span className="font-medium">{d.id_type}</span></div>}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Address</h4>
                    <div className="text-sm space-y-1">
                      <div>{[d.street, d.barangay, d.municipality, d.province].filter(Boolean).join(', ')}</div>
                      <div className="text-gray-500">{[d.region, d.postal_code].filter(Boolean).join(' — ')}</div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  {(d.emergency_contact_person || d.emergency_contact_number) && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Emergency Contact</h4>
                      <div className="text-sm">
                        <div className="font-medium">{d.emergency_contact_person || '—'}</div>
                        <div className="text-gray-500">{d.emergency_contact_number ? `0${d.emergency_contact_number}` : '—'}</div>
                      </div>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="pt-3 border-t text-xs text-gray-400 flex justify-between">
                    <span>Status: <StatusBadge status={selected.status} /></span>
                    <span>{selected.remarks}</span>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
