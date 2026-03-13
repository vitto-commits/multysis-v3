'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<any>({ question: '', answer: '', display_order: 0, is_active: true })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetch = async () => {
    const { data } = await supabase.from('ms_faqs').select('*').order('display_order')
    setFaqs(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openNew = () => { setForm({ question: '', answer: '', display_order: faqs.length + 1, is_active: true }); setEditId(null); setModal(true) }
  const openEdit = (faq: any) => { setForm({ ...faq }); setEditId(faq.id); setModal(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editId) await supabase.from('ms_faqs').update(form).eq('id', editId)
    else await supabase.from('ms_faqs').insert(form)
    setModal(false)
    await fetch()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return
    await supabase.from('ms_faqs').delete().eq('id', id)
    await fetch()
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">FAQs</h1>
          <p className="text-gray-500 text-sm">Manage frequently asked questions</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">+ Add FAQ</button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-20"></div>)}</div>
      ) : (
        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">#{faq.display_order}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {faq.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{faq.question}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(faq)} className="text-primary hover:underline text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(faq.id)} className="text-danger hover:underline text-xs font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {faqs.length === 0 && <div className="card text-center py-12 text-gray-400">No FAQs yet</div>}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="font-bold text-gray-900 text-lg mb-4">{editId ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="label">Question</label>
                <input type="text" className="input" value={form.question} onChange={e => setForm((p: any) => ({ ...p, question: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Answer</label>
                <textarea className="input" rows={4} value={form.answer} onChange={e => setForm((p: any) => ({ ...p, answer: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Display Order</label>
                <input type="number" className="input" value={form.display_order} onChange={e => setForm((p: any) => ({ ...p, display_order: parseInt(e.target.value) }))} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm((p: any) => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4" />
                <span className="text-sm">Active (visible on public FAQ page)</span>
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
