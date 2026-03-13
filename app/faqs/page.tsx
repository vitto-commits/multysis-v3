'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('ms_faqs').select('*').eq('is_active', true).order('display_order').then(({ data }) => {
      setFaqs(data || [])
      setLoading(false)
    })
  }, [])

  const defaultFaqs = [
    { id: 1, question: 'How do I apply for a service?', answer: 'Create an account, browse services, select the one you need, fill out the application form, and submit. You will receive a transaction code to track your application.' },
    { id: 2, question: 'How long does processing take?', answer: 'Processing times vary by service. Most certificates and clearances take 3–5 business days. Permits may take 7–14 business days. You will be notified when your document is ready.' },
    { id: 3, question: 'How do I track my application?', answer: 'Go to "My Applications" in the navigation menu. You can see all your submitted applications and their current status.' },
    { id: 4, question: 'What payment methods are accepted?', answer: 'Payment can be made at the City Hall cashier. Bring your transaction code and a valid ID. Online payment options are coming soon.' },
    { id: 5, question: 'Can I apply for someone else?', answer: 'Some services allow authorized representatives. Bring a Special Power of Attorney (SPA) and your valid ID.' },
    { id: 6, question: 'What if my application is rejected?', answer: 'You will receive a notification with the reason for rejection. You can resubmit with the required corrections.' },
  ]

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold mb-2">Frequently Asked Questions</h1>
          <p className="text-blue-100">Find answers to common questions about Multysis and city services</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {displayFaqs.map((faq, i) => (
              <div key={faq.id} className="card border border-gray-100 overflow-hidden p-0">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {open === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    <div className="pt-3">{faq.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 card bg-blue-50 border-blue-100 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-500 text-sm mb-4">Contact the City Hall for further assistance.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:055-560-9999" className="btn-primary text-sm py-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (055) 560-9999
            </a>
            <a href="mailto:info@borongancity.gov.ph" className="btn-secondary text-sm py-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
