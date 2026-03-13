'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type NavItem = {
  href: string
  label: string
  icon: string
  roles: string[]
  group?: string
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', group: 'main', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', roles: ['admin', 'bplo', 'assessor', 'treasurer', 'csdo', 'staff'] },
  { href: '/admin/transactions', label: 'Transactions', group: 'services', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: ['admin', 'bplo', 'assessor', 'treasurer'] },
  { href: '/admin/appointments', label: 'Appointments', group: 'services', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', roles: ['admin', 'bplo'] },
  { href: '/admin/services', label: 'Services', group: 'services', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', roles: ['admin', 'bplo'] },
  { href: '/admin/payments', label: 'Payments', group: 'services', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', roles: ['admin', 'treasurer'] },
  { href: '/admin/citizens', label: 'Citizens', group: 'people', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', roles: ['admin', 'bplo'] },
  { href: '/admin/beneficiaries', label: 'Beneficiaries', group: 'people', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', roles: ['admin', 'csdo'] },
  { href: '/admin/programs', label: 'Programs', group: 'people', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', roles: ['admin', 'csdo'] },
  { href: '/admin/tax-profiles', label: 'Tax Profiles', group: 'records', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', roles: ['admin', 'assessor'] },
  { href: '/admin/addresses', label: 'Addresses', group: 'records', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', roles: ['admin'] },
  { href: '/admin/reports', label: 'Reports', group: 'records', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', roles: ['admin', 'treasurer'] },
  { href: '/admin/faqs', label: 'FAQs', group: 'config', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', roles: ['admin'] },
  { href: '/admin/users', label: 'Users', group: 'config', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', roles: ['admin'] },
]

const groupLabels: Record<string, string> = {
  main: '',
  services: 'Services',
  people: 'People',
  records: 'Records',
  config: 'Configuration',
}

const roleLabels: Record<string, string> = {
  admin: 'Central Admin',
  bplo: 'BPLO',
  assessor: "Assessor's Office",
  treasurer: "Treasurer's Office",
  csdo: 'CSDO',
  staff: 'Staff',
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [userRole, setUserRole] = useState<string>('admin')
  const supabase = createClient()

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('ms_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single()
        if (profile) setUserRole(profile.role)
      }
    }
    fetchRole()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const visibleItems = navItems.filter(item => item.roles.includes(userRole))

  // Group items
  const groups = ['main', 'services', 'people', 'records', 'config']
  const groupedItems = groups.map(g => ({
    group: g,
    label: groupLabels[g],
    items: visibleItems.filter(i => i.group === g),
  })).filter(g => g.items.length > 0)

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300 ${
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={() => setCollapsed(true)}
      />

      <aside className={`
        fixed top-0 left-0 h-screen bg-sidebar z-30 flex flex-col
        transition-all duration-300 ease-smooth
        ${collapsed ? '-translate-x-full md:translate-x-0 md:w-[64px]' : 'translate-x-0 w-64'}
        md:relative md:flex
      `}>
        {/* Header */}
        <div className={`flex items-center border-b border-white/6 ${collapsed ? 'justify-center px-3 py-4' : 'justify-between px-4 py-4'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <img src="/city-seal.png" alt="" className="w-6 h-6 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-white font-bold text-sm leading-none truncate">Borongan E-Services</div>
                <div className="text-blue-400/70 text-xs mt-0.5 truncate">{roleLabels[userRole] || 'Admin Panel'}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/8 transition-all flex-shrink-0 ${collapsed ? '' : ''}`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-4 h-4 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
          {groupedItems.map(({ group, label, items }) => (
            <div key={group}>
              {label && !collapsed && (
                <div className="px-3 pt-3 pb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">{label}</span>
                </div>
              )}
              {label && !collapsed && <div className="h-px bg-white/5 mb-1 mx-2" />}
              {items.map(item => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      active
                        ? 'bg-primary/20 text-white'
                        : 'text-gray-400 hover:bg-white/6 hover:text-gray-200'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active left accent */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                    )}
                    <svg className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}
                      style={{ width: '18px', height: '18px' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    {!collapsed && (
                      <span className={`${active ? 'font-semibold' : ''}`}>{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/6 px-2 py-3 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-200 hover:bg-white/6 transition-all"
            title={collapsed ? 'Public Portal' : undefined}
          >
            <svg className="flex-shrink-0" style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {!collapsed && <span>Public Portal</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
            title={collapsed ? 'Sign Out' : undefined}
          >
            <svg className="flex-shrink-0" style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
