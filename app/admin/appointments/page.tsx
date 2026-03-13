'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import StatusBadge from '@/components/StatusBadge'
import { TableSkeleton } from '@/components/LoadingSkeleton'

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('ms_appointments')
      .select('*, ms_services(name), ms_profiles(first_name, last_name)')
      .order('scheduled_date', { ascending: true })
      .then(({ data }) => { setAppointments(data || []); setLoading(false) })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('ms_appointments').update({ status }).eq('id', id)
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Appointments</h1>
        <p className="text-gray-500 text-sm">Scheduled citizen appointments</p>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={6} /></div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📅</div>
            <p>No appointments scheduled</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Citizen</th>
                  <th className="text-left px-5 py-3 font-medium">Service</th>
                  <th className="text-left px-5 py-3 font-medium">Date & Time</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {apt.ms_profiles?.first_name} {apt.ms_profiles?.last_name}
                    </td>
                    <td className="px-5 py-3 text-gray-700">{apt.ms_services?.name || '—'}</td>
                    <td className="px-5 py-3 text-gray-700">
                      {apt.scheduled_date ? new Date(apt.scheduled_date).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : '—'}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={apt.status} /></td>
                    <td className="px-5 py-3">
                      <select
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                        value={apt.status}
                        onChange={e => updateStatus(apt.id, e.target.value)}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
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
