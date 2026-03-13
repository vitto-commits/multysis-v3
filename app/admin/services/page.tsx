'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TableSkeleton } from '@/components/LoadingSkeleton'

const categoryOptions = ['PERMITS', 'CERTIFICATES', 'CLEARANCES', 'CIVIL_REGISTRY', 'IDS', 'SPECIAL_PERMITS', 'TAX']

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({})
  const supabase = createClient()

  const fetch = async () => {
    const { data } = await supabase.from('ms_services').select('*').order('category')
    setServices(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openEdit = (svc: any) => { setForm({ ...svc }); setModal('edit') }
  const openNew = () => { setForm({ name: '', code: '', category: 'PERMITS', description: '', requires_payment: false, default_amount: 0 }); setModal('new') }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (modal === 'new') {
      await supabase.from('ms_services').insert({ ...form })
    } else {
      await supabase.from('ms_services').update({ ...form }).eq('id', form.id)
    }
    setModal(null)
    await fetch()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await supabase.from('ms_services').delete().eq('id', id)
    await fetch()
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm">Manage city government services</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">+ Add Service</button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={8} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Code</th>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Category</th>
                  <th className="text-left px-5 py-3 font-medium">Fee</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map(svc => (
                  <tr key={svc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{svc.code}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{svc.name}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">{svc.category}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {svc.requires_payment ? `₱${svc.default_amount?.toFixed(2)}` : <span className="text-success">Free</span>}
                    </td>
                    <td className="px-5 py-3 flex gap-2">
                      <button onClick={() => openEdit(svc)} className="text-primary hover:underline text-xs font-medium">Edit</button>
                      <button onClick={() => handleDelete(svc.id)} className="text-danger hover:underline text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="font-bold text-gray-900 text-lg mb-4">{modal === 'new' ? 'Add Service' : 'Edit Service'}</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Service Code</label>
                  <input type="text" className="input font-mono" value={form.code || ''} onChange={e => setForm((p: any) => ({ ...p, code: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={form.category || ''} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}>
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Name</label>
                <input type="text" className="input" value={form.name || ''} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={2} value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.requires_payment || false} onChange={e => setForm((p: any) => ({ ...p, requires_payment: e.target.checked }))} className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-700">Requires Payment</span>
                </label>
                {form.requires_payment && (
                  <input type="number" className="input w-32" placeholder="Amount" value={form.default_amount || ''} onChange={e => setForm((p: any) => ({ ...p, default_amount: parseFloat(e.target.value) }))} />
                )}
              </div>
              <div>
                <label className="label">Form Fields (JSON)</label>
                <textarea
                  className="input font-mono text-xs"
                  rows={4}
                  placeholder='{"fields": [{"name": "purpose", "label": "Purpose", "type": "text", "required": true}]}'
                  value={form.form_fields ? JSON.stringify(form.form_fields, null, 2) : ''}
                  onChange={e => {
                    try { setForm((p: any) => ({ ...p, form_fields: JSON.parse(e.target.value) })) } catch {}
                  }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
