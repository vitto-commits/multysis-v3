'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TableSkeleton } from '@/components/LoadingSkeleton'

const roleLabels: Record<string, string> = {
  admin: 'Master Admin',
  bplo: 'BPLO',
  assessor: "Assessor's Office",
  treasurer: "Treasurer's Office",
  staff: 'Staff',
  citizen: 'Citizen',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('ms_profiles').select('*').in('role', ['admin', 'staff', 'bplo', 'assessor', 'treasurer']).order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false) })
  }, [])

  const updateRole = async (id: string, role: string) => {
    await supabase.from('ms_profiles').update({ role }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 text-sm">Manage admin and staff accounts</p>
        </div>
      </div>

      <div className="card bg-amber-50 border-amber-200 mb-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-amber-800">
          <p className="font-semibold">Default Admin Account</p>
          <p>Email: <code>admin@borongancity.com</code> — Change password after first login for security.</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={4} /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No admin users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Phone</th>
                  <th className="text-left px-5 py-3 font-medium">Role</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-sidebar text-white flex items-center justify-center font-bold text-sm">
                          {u.first_name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <span className="font-medium text-gray-900">{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{u.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'bplo' ? 'bg-blue-100 text-blue-700' :
                        u.role === 'assessor' ? 'bg-amber-100 text-amber-700' :
                        u.role === 'treasurer' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{roleLabels[u.role] || u.role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                        value={u.role}
                        onChange={e => updateRole(u.id, e.target.value)}
                      >
                        <option value="admin">Master Admin</option>
                        <option value="bplo">BPLO</option>
                        <option value="assessor">Assessor&apos;s Office</option>
                        <option value="treasurer">Treasurer&apos;s Office</option>
                        <option value="staff">Staff</option>
                        <option value="citizen">Citizen (demote)</option>
                      </select>
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
