'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { useSearchParams } from 'next/navigation'

const categoryLabels: Record<string, string> = {
  PERMITS: 'Permits',
  CERTIFICATES: 'Certificates',
  CLEARANCES: 'Clearances',
  CIVIL_REGISTRY: 'Civil Registry',
  IDS: 'IDs & Cards',
  SPECIAL_PERMITS: 'Special Permits',
  TAX: 'Tax Services',
}

const categoryColors: Record<string, string> = {
  PERMITS: 'bg-blue-100 text-blue-700',
  CERTIFICATES: 'bg-indigo-100 text-indigo-700',
  CLEARANCES: 'bg-green-100 text-green-700',
  CIVIL_REGISTRY: 'bg-purple-100 text-purple-700',
  IDS: 'bg-orange-100 text-orange-700',
  SPECIAL_PERMITS: 'bg-rose-100 text-rose-700',
  TAX: 'bg-amber-100 text-amber-700',
}

const categoryIcons: Record<string, string> = {
  PERMITS: '📋',
  CERTIFICATES: '📜',
  CLEARANCES: '✅',
  CIVIL_REGISTRY: '📂',
  IDS: '🪪',
  SPECIAL_PERMITS: '⚡',
  TAX: '💰',
}

function ServicesContent() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActiveCategory(cat)
  }, [searchParams])

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('ms_services')
        .select('*')
        .order('category')
      setServices(data || [])
      setLoading(false)
    }
    fetchServices()
  }, [])

  const filtered = services.filter(s => {
    const matchSearch = !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = !activeCategory || s.category === activeCategory
    return matchSearch && matchCat
  })

  const categories = Array.from(new Set(services.map(s => s.category)))

  return (
    <>
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !activeCategory ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/30'
          }`}
        >
          All Services
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/30'
            }`}
          >
            {categoryIcons[cat]} {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <div key={service.id} className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{categoryIcons[service.category] || '📄'}</div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[service.category] || 'bg-gray-100 text-gray-700'}`}>
                  {categoryLabels[service.category] || service.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-500 flex-1 leading-relaxed mb-4">
                {service.description || 'Apply for this city government service online.'}
              </p>
              {service.requires_payment && (
                <div className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                  <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Fee: ₱{service.default_amount?.toFixed(2) || '0.00'}
                </div>
              )}
              <Link href={`/services/${service.code}`} className="btn-primary text-sm py-2 justify-center">
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-2">Government Services</h1>
          <p className="text-blue-100">Browse and apply for City of Borongan government services online</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        }>
          <ServicesContent />
        </Suspense>
      </section>

      <Footer />
    </div>
  )
}
