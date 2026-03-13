'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

const categoryLabels: Record<string, string> = {
  PERMITS: 'Permits',
  CERTIFICATES: 'Certificates',
  CLEARANCES: 'Clearances',
  CIVIL_REGISTRY: 'Civil Registry',
  IDS: 'IDs & Cards',
  SPECIAL_PERMITS: 'Special Permits',
  TAX: 'Tax Services',
}

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
          <div className="text-6xl mb-4">😕</div>
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

  const formFields: any[] = service.form_fields?.fields || []

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
            <div className="card">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{service.category === 'PERMITS' ? '📋' : service.category === 'CLEARANCES' ? '✅' : '📄'}</div>
                <div>
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 mb-2">
                    {categoryLabels[service.category] || service.category}
                  </span>
                  <h1 className="text-2xl font-extrabold text-gray-900">{service.name}</h1>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {service.description || 'Apply for this official city government service through the Multysis digital portal.'}
              </p>
            </div>

            {/* Requirements */}
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Requirements
              </h2>
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
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Processing Time</dt>
                  <dd className="text-sm font-medium text-gray-800 mt-0.5">3–5 Business Days</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Payment Required</dt>
                  <dd className="mt-0.5">
                    {service.requires_payment
                      ? <span className="text-sm font-medium text-gray-800">₱{service.default_amount?.toFixed(2)}</span>
                      : <span className="text-sm font-medium text-success">Free</span>
                    }
                  </dd>
                </div>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
