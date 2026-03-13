'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<any>({ name: '', description: '', type: '', is_active: true })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetch = async () => {
    const { data } = await supabase.from('ms_government_programs').select('*').order('created_at', { ascending: false })
    setPrograms(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openNew = () => { setForm({ name: '', description: '', type: '', is_active: true }); setEditId(null); setModal(true) }
  const openEdit = (p: any) => { setForm({ ...p }); setEditId(p.id); setModal(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editId) {
      await supabase.from('ms_government_programs').update(form).eq('id', editId)
    } else {
      await supabase.from('ms_government_programs').insert(form)
    }
    setModal(false)
    await fetch()
    setSaving(false)
  }

  const toggleActive = async (id: string, is_active: boolean) => {
    await supabase.from('ms_government_programs').update({ is_active: !is_active }).eq('id', id)
    await fetch()
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Government Programs</h1>
          <p className="text-gray-500 text-sm">Social welfare and government programs</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">+ Add Program</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="card h-36"></div>)}
        </div>
      ) : programs.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">No programs yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map(prog => (
            <div key={prog.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900">{prog.name}</h3>
                <button
                  onClick={() => toggleActive(prog.id, prog.is_active)}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${prog.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {prog.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
              {prog.type && <div className="text-xs text-gray-500 mb-2 capitalize">{prog.type}</div>}
              <p className="text-sm text-gray-600 flex-1">{prog.description || 'No description'}</p>
              <button onClick={() => openEdit(prog)} className="text-xs text-primary hover:underline mt-3">Edit</button>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="font-bold text-gray-900 text-lg mb-4">{editId ? 'Edit' : 'Add'} Program</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="label">Name</label>
                <input type="text" className="input" value={form.name} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Type</label>
                <input type="text" className="input" placeholder="e.g. SOCIAL_WELFARE" value={form.type} onChange={e => setForm((p: any) => ({ ...p, type: e.target.value }))} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm((p: any) => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
