'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const civilStatusOptions = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced']
const sexOptions = ['Male', 'Female']
const idTypes = [
  'Philippine National ID (PhilSys)',
  'SSS ID',
  'GSIS ID',
  'Unified Multi-Purpose ID (UMID)',
  "Driver's License",
  'Passport',
  "Voter's ID",
  'PRC ID',
  'Postal ID',
  'Barangay ID',
  'Senior Citizen ID',
  'PWD ID',
  'PhilHealth ID',
  'TIN ID',
  'Other',
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    firstName: '', middleName: '', lastName: '', extensionName: '',
    birthdate: '', sex: '', civilStatus: '', profession: '',
    phone: '', email: '', password: '', confirmPassword: '',
    region: '', province: '', municipality: '', barangay: '',
    street: '', postalCode: '',
    placeOfBirth: '', spouseName: '',
    emergencyContactPerson: '', emergencyContactNumber: '',
    idType: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { first_name: form.firstName, last_name: form.lastName, phone: form.phone } }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      const address = [form.street, form.barangay, form.municipality, form.province, form.region].filter(Boolean).join(', ')

      await supabase.from('ms_profiles').insert({
        user_id: authData.user.id,
        role: 'citizen',
        first_name: form.firstName,
        middle_name: form.middleName || null,
        last_name: form.lastName,
        phone: form.phone,
        address,
      })

      // Create citizens record for Borongan portal interop
      try {
        await supabase.from('citizens').insert({
          user_id: authData.user.id,
          first_name: form.firstName,
          middle_name: form.middleName || null,
          last_name: form.lastName,
          extension_name: form.extensionName || null,
          email: form.email,
          phone: form.phone,
          birthdate: form.birthdate || null,
          sex: form.sex || null,
          civil_status: form.civilStatus || null,
          profession: form.profession || null,
          region: form.region || null,
          province: form.province || null,
          municipality: form.municipality || null,
          barangay: form.barangay || null,
          street: form.street || null,
          postal_code: form.postalCode || null,
          place_of_birth: form.placeOfBirth || null,
          spouse_name: form.spouseName || null,
          emergency_contact_person: form.emergencyContactPerson || null,
          emergency_contact_number: form.emergencyContactNumber || null,
          id_type: form.idType || null,
        })
      } catch {}
    }

    router.push('/')
    router.refresh()
  }

  const canGoNext = () => {
    if (step === 1) return form.firstName && form.lastName && form.birthdate && form.sex && form.civilStatus
    if (step === 2) return form.phone && form.region && form.province && form.municipality && form.barangay
    if (step === 3) return form.email && form.password && form.confirmPassword
    return true
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-2">
            <img src="/city-seal.png" alt="City of Borongan Seal" className="w-10 h-10 object-contain" />
            <div className="text-left">
              <div className="font-bold text-gray-900 leading-none">Borongan E-Services</div>
              <div className="text-xs text-gray-500">City of Borongan</div>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-4">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Register to access City of Borongan digital services</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {['Personal Info', 'Address & Contact', 'Account & ID'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1 ? 'bg-green-500 text-white' :
                step === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i + 1 ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step === i + 1 ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className="w-8 h-0.5 bg-gray-200 hidden sm:block" />}
            </div>
          ))}
        </div>

        <div className="card shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-danger">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name <span className="text-danger">*</span></label>
                    <input type="text" className="input" placeholder="Juan" value={form.firstName} onChange={update('firstName')} required />
                  </div>
                  <div>
                    <label className="label">Middle Name <span className="text-gray-400 text-xs">(Optional)</span></label>
                    <input type="text" className="input" placeholder="Santos" value={form.middleName} onChange={update('middleName')} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Last Name <span className="text-danger">*</span></label>
                    <input type="text" className="input" placeholder="dela Cruz" value={form.lastName} onChange={update('lastName')} required />
                  </div>
                  <div>
                    <label className="label">Extension Name <span className="text-gray-400 text-xs">(e.g., Jr., III)</span></label>
                    <input type="text" className="input" placeholder="Jr." value={form.extensionName} onChange={update('extensionName')} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Birthdate <span className="text-danger">*</span></label>
                    <input type="date" className="input" value={form.birthdate} onChange={update('birthdate')} required />
                  </div>
                  <div>
                    <label className="label">Sex <span className="text-danger">*</span></label>
                    <select className="input" value={form.sex} onChange={update('sex')} required>
                      <option value="">Select</option>
                      {sexOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Civil Status <span className="text-danger">*</span></label>
                    <select className="input" value={form.civilStatus} onChange={update('civilStatus')} required>
                      <option value="">Select</option>
                      {civilStatusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Profession <span className="text-gray-400 text-xs">(Optional)</span></label>
                    <input type="text" className="input" placeholder="e.g., Teacher" value={form.profession} onChange={update('profession')} />
                  </div>
                  <div>
                    <label className="label">Place of Birth</label>
                    <input type="text" className="input" placeholder="City / Municipality" value={form.placeOfBirth} onChange={update('placeOfBirth')} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address & Contact */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Address & Contact</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Region <span className="text-danger">*</span></label>
                    <input type="text" className="input" placeholder="Region VIII" value={form.region} onChange={update('region')} required />
                  </div>
                  <div>
                    <label className="label">Province <span className="text-danger">*</span></label>
                    <input type="text" className="input" placeholder="Eastern Samar" value={form.province} onChange={update('province')} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Municipality <span className="text-danger">*</span></label>
                    <input type="text" className="input" placeholder="Borongan City" value={form.municipality} onChange={update('municipality')} required />
                  </div>
                  <div>
                    <label className="label">Barangay <span className="text-danger">*</span></label>
                    <input type="text" className="input" placeholder="Barangay name" value={form.barangay} onChange={update('barangay')} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Street</label>
                    <input type="text" className="input" placeholder="Street / Purok / Sitio" value={form.street} onChange={update('street')} />
                  </div>
                  <div>
                    <label className="label">Postal Code</label>
                    <input type="text" className="input" placeholder="6800" value={form.postalCode} onChange={update('postalCode')} />
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <label className="label">Phone Number <span className="text-danger">*</span></label>
                  <input type="tel" className="input" placeholder="09XX XXX XXXX" value={form.phone} onChange={update('phone')} required />
                </div>
                <div>
                  <label className="label">Spouse Name <span className="text-gray-400 text-xs">(if applicable)</span></label>
                  <input type="text" className="input" placeholder="Full name of spouse" value={form.spouseName} onChange={update('spouseName')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Emergency Contact Person</label>
                    <input type="text" className="input" placeholder="Full name" value={form.emergencyContactPerson} onChange={update('emergencyContactPerson')} />
                  </div>
                  <div>
                    <label className="label">Emergency Contact Number</label>
                    <input type="tel" className="input" placeholder="09XX XXX XXXX" value={form.emergencyContactNumber} onChange={update('emergencyContactNumber')} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Account & ID */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Account & Identification</h2>
                <div>
                  <label className="label">Email Address <span className="text-danger">*</span></label>
                  <input type="email" className="input" placeholder="juan@example.com" value={form.email} onChange={update('email')} required autoComplete="email" />
                </div>
                <div>
                  <label className="label">Password <span className="text-danger">*</span></label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={update('password')}
                      required
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPw ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm Password <span className="text-danger">*</span></label>
                  <input type="password" className="input" placeholder="Repeat password" value={form.confirmPassword} onChange={update('confirmPassword')} required autoComplete="new-password" />
                </div>

                <hr className="border-gray-100" />

                <div>
                  <label className="label">ID Type <span className="text-gray-400 text-xs">(for verification)</span></label>
                  <select className="input" value={form.idType} onChange={update('idType')}>
                    <option value="">Select ID type</option>
                    {idTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex-1 justify-center">
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canGoNext()}
                  className="btn-primary flex-1 justify-center py-3"
                >
                  Next
                </button>
              ) : (
                <button type="submit" disabled={loading || !canGoNext()} className="btn-primary flex-1 justify-center py-3">
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
