import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const CategoryIcon = ({ id, className = "w-6 h-6" }: { id: string; className?: string }) => {
  switch (id) {
    case 'PERMITS':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
    case 'CERTIFICATES':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
    case 'CLEARANCES':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
    case 'CIVIL_REGISTRY':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
    case 'IDS':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
    case 'SPECIAL_PERMITS':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
    case 'TAX':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
    default:
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
  }
}

const categories = [
  { id: 'PERMITS', label: 'Permits', desc: 'Business permits, building permits, and other regulatory permits', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-200' },
  { id: 'CERTIFICATES', label: 'Certificates', desc: 'Community tax certificates and other certifications', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', ring: 'ring-indigo-200' },
  { id: 'CLEARANCES', label: 'Clearances', desc: 'Barangay clearances and other clearance documents', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
  { id: 'CIVIL_REGISTRY', label: 'Civil Registry', desc: 'Birth, marriage, and death certificates from the civil registry', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-200' },
  { id: 'IDS', label: 'IDs & Cards', desc: 'PWD ID, Senior Citizen ID, and other government-issued IDs', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-200' },
  { id: 'SPECIAL_PERMITS', label: 'Special Permits', desc: 'Events, construction, transport, demolition, and excavation permits', color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', ring: 'ring-rose-200' },
]

const steps = [
  {
    num: '01', label: 'Create Account', desc: 'Register as a citizen of Borongan City',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    num: '02', label: 'Choose Service', desc: 'Browse and select the service you need',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
  {
    num: '03', label: 'Submit Application', desc: 'Fill out the form and submit your application',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    num: '04', label: 'Track & Receive', desc: 'Monitor status and pick up your document',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
]

const announcements = [
  { tag: 'New', text: 'Online application for Business Permits now available', date: 'Mar 10, 2026' },
  { tag: 'Update', text: 'Extended processing hours: 7AM–6PM effective April 1', date: 'Mar 8, 2026' },
  { tag: 'Notice', text: 'Civil Registry documents now digitally available for pickup', date: 'Mar 1, 2026' },
]

const stats = [
  { label: 'Services Available', value: '16+', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'text-blue-600 bg-blue-100' },
  { label: 'Registered Citizens', value: '1,200+', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'text-emerald-600 bg-emerald-100' },
  { label: 'Applications Processed', value: '5,000+', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-indigo-600 bg-indigo-100' },
  { label: 'Avg. Processing Time', value: '3 Days', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-600 bg-amber-100' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-700 to-accent">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div style={{ animation: 'fadeInUp 0.7s ease-out both' }}>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/20">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                City of Borongan, Eastern Samar
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                Your Digital Gateway<br />
                <span className="text-blue-200">to City Services</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-lg">
                Access government services online — apply for permits, certificates, clearances, and more. Fast, transparent, and available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/services" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 active:scale-[0.98] transition-all shadow-lg text-sm">
                  Browse Services
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 active:scale-[0.98] transition-all border border-white/30 text-sm">
                  Create Account
                </Link>
              </div>
              {/* Trust indicators */}
              <div className="flex items-center gap-4 mt-8">
                {['Secure', 'Free', '24/7 Access'].map(tag => (
                  <div key={tag} className="flex items-center gap-1.5 text-blue-200 text-xs">
                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration */}
            <div className="hidden lg:flex justify-center" style={{ animation: 'fadeInUp 0.7s 0.15s ease-out both' }}>
              <div className="relative">
                <div className="w-80 h-80 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
                  <svg className="w-52 h-52 text-white/80" fill="none" viewBox="0 0 200 200" stroke="currentColor">
                    <rect x="10" y="100" width="30" height="90" rx="2" strokeWidth="2" fill="rgba(255,255,255,0.15)"/>
                    <rect x="20" y="80" width="10" height="20" rx="1" strokeWidth="1.5" fill="rgba(255,255,255,0.1)"/>
                    <rect x="50" y="60" width="40" height="130" rx="2" strokeWidth="2" fill="rgba(255,255,255,0.2)"/>
                    <rect x="55" y="50" width="15" height="15" rx="1" strokeWidth="1.5" fill="rgba(255,255,255,0.15)"/>
                    <rect x="100" y="40" width="50" height="150" rx="2" strokeWidth="2" fill="rgba(255,255,255,0.25)"/>
                    <rect x="110" y="25" width="15" height="20" rx="1" strokeWidth="1.5" fill="rgba(255,255,255,0.2)"/>
                    <rect x="160" y="70" width="30" height="120" rx="2" strokeWidth="2" fill="rgba(255,255,255,0.15)"/>
                    <rect x="55" y="70" width="8" height="8" rx="1" fill="rgba(255,255,255,0.4)"/>
                    <rect x="72" y="70" width="8" height="8" rx="1" fill="rgba(255,255,255,0.4)"/>
                    <rect x="55" y="90" width="8" height="8" rx="1" fill="rgba(255,255,255,0.3)"/>
                    <rect x="72" y="90" width="8" height="8" rx="1" fill="rgba(255,255,255,0.4)"/>
                    <rect x="108" y="55" width="10" height="10" rx="1" fill="rgba(255,255,255,0.4)"/>
                    <rect x="130" y="55" width="10" height="10" rx="1" fill="rgba(255,255,255,0.3)"/>
                    <rect x="108" y="78" width="10" height="10" rx="1" fill="rgba(255,255,255,0.4)"/>
                    <rect x="130" y="78" width="10" height="10" rx="1" fill="rgba(255,255,255,0.4)"/>
                    <line x1="0" y1="190" x2="200" y2="190" strokeWidth="2" stroke="rgba(255,255,255,0.3)"/>
                    <circle cx="15" cy="30" r="2" fill="rgba(255,255,255,0.6)"/>
                    <circle cx="180" cy="20" r="1.5" fill="rgba(255,255,255,0.5)"/>
                    <circle cx="165" cy="45" r="1" fill="rgba(255,255,255,0.4)"/>
                  </svg>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-modal p-3.5 flex items-center gap-2.5 animate-float">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">Application</div>
                    <div className="text-xs text-green-600 font-medium">Approved!</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-modal p-3.5 flex items-center gap-2.5" style={{ animation: 'float 3s 1.5s ease-in-out infinite' }}>
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">16 Services</div>
                    <div className="text-xs text-gray-500">Available now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center group"
                style={{ animation: `fadeInUp 0.5s ${i * 0.1}s ease-out both` }}
              >
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <div className="text-2xl font-extrabold text-primary">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3 bg-blue-50 px-3 py-1 rounded-full">Services</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Browse by Category</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Find the government service you need, organized by category for easy access.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/services?category=${cat.id}`}
              className="group card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 hover:border-blue-200/60"
              style={{ animation: `fadeInUp 0.5s ${0.1 + i * 0.07}s ease-out both` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <CategoryIcon id={cat.id} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{cat.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-primary text-sm font-semibold">
                View services
                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3 bg-blue-50 px-3 py-1 rounded-full">Process</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Applying for city services has never been easier. Follow these simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center group" style={{ animation: `fadeInUp 0.5s ${0.1 + i * 0.1}s ease-out both` }}>
                <div className="relative inline-block mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto group-hover:bg-primary/15 transition-colors duration-200">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+36px)] w-[calc(100%-72px)] h-px bg-gradient-to-r from-gray-200 to-gray-100" />
                )}
                <h3 className="font-bold text-gray-900 mb-2">{step.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/register" className="btn-primary text-base px-8 py-3.5">
              Get Started Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3 bg-blue-50 px-3 py-1 rounded-full">Announcements</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Latest Updates</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Stay informed about new services and important city announcements.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {announcements.map((item, i) => (
            <div
              key={i}
              className="card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              style={{ animation: `fadeInUp 0.5s ${0.1 + i * 0.1}s ease-out both` }}
            >
              <div className="flex items-start gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                  item.tag === 'New' ? 'bg-green-100 text-green-700' :
                  item.tag === 'Update' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{item.tag}</span>
              </div>
              <p className="font-medium text-gray-800 mt-3 mb-3 leading-snug group-hover:text-primary transition-colors">{item.text}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {item.date}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-blue-700 p-10 text-center shadow-btn-hover">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200"><defs><pattern id="cta-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#cta-grid)" /></svg>
          </div>
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white mb-3">Ready to Get Started?</h2>
            <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto">Join thousands of Borongan citizens accessing government services online.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-sm">
                Create Free Account
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/20 transition-all border border-white/30 text-sm">
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
