'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      const { data: profile } = await supabase.from('ms_profiles').select('role').eq('user_id', data.user.id).single()
      if (!profile || !['admin', 'staff', 'bplo', 'assessor', 'treasurer', 'csdo'].includes(profile.role)) {
        await supabase.auth.signOut()
        setError('Access denied. Admin credentials required.')
        setLoading(false)
        return
      }
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative w-full max-w-md" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/15 mb-4">
            <img src="/city-seal.png" alt="City of Borongan Seal" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">City of Borongan — Borongan E-Services</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-8 shadow-modal">
          {error && (
            <div className="mb-5 p-3.5 bg-red-900/40 border border-red-700/60 rounded-xl text-sm text-red-300 flex items-start gap-2 animate-fade-in">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="admin-email">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                className="w-full bg-gray-900/60 border border-gray-600/80 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all text-sm hover:border-gray-500"
                placeholder="admin@borongancity.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-label="Email address"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300" htmlFor="admin-password">Password</label>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  className="w-full bg-gray-900/60 border border-gray-600/80 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all text-sm pr-10 hover:border-gray-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-0.5 rounded transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPw
                      ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    } />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all mt-2 text-sm shadow-btn hover:shadow-btn-hover flex items-center justify-center gap-2 disabled:opacity-55"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In to Admin'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          <Link href="/" className="text-accent hover:text-white transition-colors inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Public Portal
          </Link>
        </p>
      </div>
    </div>
  )
}
