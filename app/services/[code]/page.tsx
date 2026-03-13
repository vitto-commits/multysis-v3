'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

const CategoryIcon = ({ id, className = "w-6 h-6" }: { id: string; className?: string }) => {
  switch (id) {
    case 'PERMITS': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
    case 'CERTIFICATES': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
    case 'CLEARANCES': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
    case 'CIVIL_REGISTRY': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
    case 'IDS': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
    case 'SPECIAL_PERMITS': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
    case 'TAX': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
    case 'BPLO': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
    default: return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
  }
}

const categoryLabels: Record<string, string> = {
  PERMITS: 'Permits',
  CERTIFICATES: 'Certificates',
  CLEARANCES: 'Clearances',
  CIVIL_REGISTRY: 'Civil Registry',
  IDS: 'IDs & Cards',
  SPECIAL_PERMITS: 'Special Permits',
  TAX: 'Tax Services',
  BPLO: 'BPLO',
}

const stepColors = ['#1E40AF', '#0EA5E9', '#059669']
const stepBg = ['bg-blue-50 border-blue-200', 'bg-sky-50 border-sky-200', 'bg-emerald-50 border-emerald-200']

export default function ServiceDetailPage() {
  const { code } = useParams()
  const router = useRouter()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [applying, setApplying] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txCode, setTxCode] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const fetchService = async () => {
      const { data } = await supabase
        .from('ms_services')
        .select('*')
        .eq('code', code)
        .single()
      setService(data)
      setLoading(false)
    }
    fetchService()
  }, [code])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/login'); return }
    setApplying(true)
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: service.id, service_data: formData }),
      })
      const data = await res.json()
      if (data.transaction_code) {
        setTxCode(data.transaction_code)
        setSuccess(true)
      }
    } catch (err) {
      console.error(err)
    }
    setApplying(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-8"></div>
          <div className="card">
            <div className="h-4 bg-gray-100 rounded mb-3 w-full"></div>
            <div className="h-4 bg-gray-100 rounded mb-3 w-5/6"></div>
            <div className="h-4 bg-gray-100 rounded w-4/6"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Service not found</h2>
          <Link href="/services" className="btn-primary mt-4">Back to Services</Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-4">Your application has been received. Track your status using your transaction code.</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-xs text-gray-500 mb-1">Transaction Code</div>
              <div className="text-2xl font-bold text-primary tracking-widest">{txCode}</div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/my-applications" className="btn-primary">View My Applications</Link>
              <Link href="/services" className="btn-secondary">Browse More</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Extract charter metadata from form_fields
  const ff = service.form_fields
  const formFields: any[] = Array.isArray(ff) ? ff : (ff?.fields || [])
  const requirementsList: any[] = (Array.isArray(ff) ? [] : ff?.requirements_list) || []
  const processingTime: string = (Array.isArray(ff) ? null : ff?.processing_time) || null
  const office: string = (Array.isArray(ff) ? null : ff?.office) || null
  const whoMayAvail: string = (Array.isArray(ff) ? null : ff?.who_may_avail) || null
  const workflowSteps: any[] = (Array.isArray(ff) ? [] : ff?.workflow_steps) || []

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary">Home</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/services" className="hover:text-primary">Services</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-800 font-medium">{service.name}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className="card">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <CategoryIcon id={service.category} className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 mb-2">
                    {categoryLabels[service.category] || service.category}
                  </span>
                  <h1 className="text-2xl font-extrabold text-gray-900">{service.name}</h1>
                  {office && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                      {office}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {service.description || 'Apply for this official city government service through the Borongan E-Services digital portal.'}
              </p>
            </div>

            {/* Who May Avail */}
            {whoMayAvail && (
              <div className="card border-l-4 border-l-primary">
                <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  Who May Avail
                </h2>
                <p className="text-sm text-gray-700">{whoMayAvail}</p>
              </div>
            )}

            {/* Workflow Steps */}
            {workflowSteps.length > 0 && (
              <div className="card">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  How to Apply
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  {workflowSteps.map((step: any, i: number) => (
                    <div key={i} className="flex-1 relative">
                      {i < workflowSteps.length - 1 && (
                        <div className="hidden sm:block absolute top-6 left-full w-4 h-0.5 bg-gray-200 z-0" style={{transform: 'translateX(-2px)'}}></div>
                      )}
                      <div className={`rounded-xl border p-4 h-full ${stepBg[i % stepBg.length]}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{backgroundColor: stepColors[i % stepColors.length]}}
                          >
                            {step.step || i + 1}
                          </div>
                          <span className="font-bold text-gray-900 text-sm uppercase tracking-wide">{step.title}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Documentary Requirements
              </h2>
              {requirementsList.length > 0 ? (
                <div className="space-y-3">
                  {requirementsList.map((req: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{req.name}</p>
                        {req.source && (
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {req.source}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {[
                    'Valid government-issued ID',
                    'Completed application form',
                    'Proof of residence (barangay clearance)',
                    'Payment of required fees (if applicable)',
                  ].map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Application Form */}
            {showForm && (
              <div className="card">
                <h2 className="font-bold text-gray-900 mb-4">Application Details</h2>
                <form onSubmit={handleApply} className="space-y-4">
                  {formFields.length > 0 ? formFields.map((field: any) => (
                    <div key={field.name}>
                      <label className="label">{field.label} {field.required && <span className="text-danger">*</span>}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          className="input"
                          rows={3}
                          value={formData[field.name] || ''}
                          onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                          required={field.required}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          className="input"
                          value={formData[field.name] || ''}
                          onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                          required={field.required}
                        >
                          <option value="">Select...</option>
                          {field.options?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          className="input"
                          value={formData[field.name] || ''}
                          onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                          required={field.required}
                        />
                      )}
                    </div>
                  )) : (
                    <>
                      <div>
                        <label className="label">Purpose of Application <span className="text-danger">*</span></label>
                        <textarea
                          className="input"
                          rows={3}
                          placeholder="Describe the purpose of your application..."
                          value={formData.purpose || ''}
                          onChange={e => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Additional Notes</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Any additional information..."
                          value={formData.notes || ''}
                          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={applying} className="btn-primary">
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Service Info</h3>
              <dl className="space-y-3">
                {processingTime && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">Processing Time</dt>
                    <dd className="text-sm font-medium text-gray-800 mt-0.5">{processingTime}</dd>
                  </div>
                )}
                {!processingTime && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">Processing Time</dt>
                    <dd className="text-sm font-medium text-gray-800 mt-0.5">3–5 Business Days</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Payment Required</dt>
                  <dd className="mt-0.5">
                    {service.requires_payment
                      ? <span className="text-sm font-medium text-gray-800">₱{service.default_amount?.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      : <span className="text-sm font-medium text-success">Free</span>
                    }
                  </dd>
                </div>
                {office && (
                  <div>
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">Office</dt>
                    <dd className="text-sm font-medium text-gray-800 mt-0.5">{office}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Service Code</dt>
                  <dd className="text-sm font-mono font-medium text-gray-800 mt-0.5">{service.code}</dd>
                </div>
              </dl>

              {!showForm ? (
                <button
                  onClick={() => {
                    if (!user) router.push('/login')
                    else setShowForm(true)
                  }}
                  className="btn-primary w-full justify-center mt-6"
                >
                  Apply Now
                </button>
              ) : null}

              {!user && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  <Link href="/login" className="text-primary hover:underline">Sign in</Link> to apply
                </p>
              )}
            </div>

            <div className="card bg-blue-50 border-blue-100">
              <h3 className="font-bold text-primary mb-2 text-sm">Need Help?</h3>
              <p className="text-xs text-gray-600 mb-3">Contact the City Hall for assistance with your application.</p>
              <a href="tel:055-560-9999" className="text-sm font-medium text-primary hover:underline">(055) 560-9999</a>
            </div>

            {requirementsList.length > 0 && (
              <div className="card bg-amber-50 border-amber-100">
                <h3 className="font-bold text-amber-800 mb-2 text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  Prepare Your Documents
                </h3>
                <p className="text-xs text-amber-700">Have all {requirementsList.length} required document{requirementsList.length > 1 ? 's' : ''} ready before visiting the office.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
