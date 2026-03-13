'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TableSkeleton } from '@/components/LoadingSkeleton'

const roleLabels: Record<string, string> = {
  admin: 'Master Admin',
  bplo: 'BPLO',
  assessor: "Assessor's Office",
  csdo: 'CSDO',
  treasurer: "Treasurer's Office",
  staff: 'Staff',
  citizen: 'Citizen',
}

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  bplo: 'bg-blue-100 text-blue-700',
  assessor: 'bg-amber-100 text-amber-700',
  treasurer: 'bg-green-100 text-green-700',
  csdo: 'bg-teal-100 text-teal-700',
  staff: 'bg-gray-100 text-gray-700',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'staff' })
  const supabase = createClient()

  const fetchUsers = () => {
    supabase.from('ms_profiles').select('*').in('role', ['admin', 'staff', 'bplo', 'assessor', 'treasurer', 'csdo']).order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false) })
  }

  useEffect(() => { fetchUsers() }, [])

  const updateRole = async (id: string, role: string) => {
    await supabase.from('ms_profiles').update({ role }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    setCreateSuccess('')

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setCreateError(data.error || 'Failed to create account')
        setCreating(false)
        return
      }

      setCreateSuccess(`Account created for ${form.email}`)
      setForm({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'staff' })
      setCreating(false)
      fetchUsers()

      // Auto-close after 2s
      setTimeout(() => { setShowCreate(false); setCreateSuccess('') }, 2000)
    } catch {
      setCreateError('Network error — please try again')
      setCreating(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 text-sm">Manage admin and staff accounts</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateError(''); setCreateSuccess('') }}
          className="btn-primary text-sm py-2.5 px-4"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Account
        </button>
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
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Change Role</th>
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
                        <div>
                          <div className="font-medium text-gray-900">{u.first_name} {u.last_name}</div>
                          <div className="text-xs text-gray-400">{u.address || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{u.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadgeColors[u.role] || 'bg-gray-100 text-gray-700'}`}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
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
                        <option value="csdo">CSDO</option>
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

      {/* Create Account Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Create Account</h3>
                <p className="text-sm text-gray-500">Add a new admin or office account</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{createError}</div>
            )}
            {createSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">First Name</label>
                  <input type="text" className="input" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Juan" />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input type="text" className="input" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Dela Cruz" />
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@borongancity.com" />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="text" className="input" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" />
              </div>
              <div>
                <label className="label">Phone (optional)</label>
                <input type="text" className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="09XX-XXX-XXXX" />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="admin">Master Admin</option>
                  <option value="bplo">BPLO</option>
                  <option value="assessor">Assessor&apos;s Office</option>
                  <option value="treasurer">Treasurer&apos;s Office</option>
                  <option value="csdo">CSDO</option>
                  <option value="staff">Staff</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {form.role === 'admin' && 'Full access to all modules and settings'}
                  {form.role === 'bplo' && 'Permits, services, citizens, appointments'}
                  {form.role === 'assessor' && 'Tax profiles and transactions'}
                  {form.role === 'treasurer' && 'Payments, collections, and reports'}
                  {form.role === 'csdo' && 'Beneficiaries and social programs'}
                  {form.role === 'staff' && 'Dashboard access only'}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 justify-center">
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
