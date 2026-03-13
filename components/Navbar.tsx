'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/faqs', label: 'FAQs' },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-nav border-b border-gray-100/80'
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/city-seal.png"
              alt="City of Borongan Seal"
              className="w-9 h-9 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div>
              <div className="font-bold text-gray-900 text-sm leading-none">Borongan E-Services</div>
              <div className="text-xs text-gray-500 leading-none mt-0.5">City of Borongan</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary hover:bg-blue-50/60'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/my-applications"
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    isActive('/my-applications') ? 'text-primary bg-blue-50' : 'text-gray-600 hover:text-primary hover:bg-blue-50/60'
                  }`}
                >
                  My Applications
                </Link>
                <Link
                  href="/profile"
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    isActive('/profile') ? 'text-primary bg-blue-50' : 'text-gray-600 hover:text-primary hover:bg-blue-50/60'
                  }`}
                >
                  Profile
                </Link>
                <button onClick={handleSignOut} className="btn-secondary text-sm py-2 px-4">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-blue-50/60 transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 menu-slide-down shadow-lg">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 py-2.5 rounded-xl transition-colors ${
                isActive(link.href) ? 'text-primary bg-blue-50 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-100 my-1" />
          {user ? (
            <>
              <Link href="/my-applications" className="text-sm font-medium text-gray-700 px-3 py-2.5 rounded-xl hover:bg-gray-50" onClick={() => setMenuOpen(false)}>My Applications</Link>
              <Link href="/profile" className="text-sm font-medium text-gray-700 px-3 py-2.5 rounded-xl hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleSignOut} className="text-sm font-medium text-danger text-left px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 px-3 py-2.5 rounded-xl hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/register" className="btn-primary text-sm mt-1" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
