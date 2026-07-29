'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Globe,
  Building2,
  FileText,
  ImageIcon,
  Sparkles,
  ChevronDown,
  MapPin,
  Clock3,
  Bell,
} from 'lucide-react'

type Service = { id: number; name: string }
type City = { id: number; name: string }

const navItems = [
  { label: 'Geographic Targets', icon: Globe, href: '/admin/cities' },
   { label: 'Business Targets', icon: Building2, href: '/admin/business-targets' },
  { label: 'Content Library', icon: FileText, href: '/admin/content-library' },
  { label: 'Media', icon: ImageIcon, href: '/admin/portfolio' },
  { label: 'Optimization', icon: Sparkles, href: '/admin/faqs' },
]

export default function ContentLibraryPage() {
  const [services, setServices] = useState<Service[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [serviceId, setServiceId] = useState<number | ''>('')
  const [cityId, setCityId] = useState<number | ''>('')

  const [pageTitle, setPageTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [heroHeading, setHeroHeading] = useState('')
  const [introText, setIntroText] = useState('')
  const [includeFaqs, setIncludeFaqs] = useState(false)
  const [includeTestimonials, setIncludeTestimonials] = useState(true)

  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/admin/services').then((r) => r.json()).then(setServices)
    fetch('/api/admin/cities').then((r) => r.json()).then(setCities)
  }, [])

  const selectedService = services.find((s) => s.id === serviceId)
  const selectedCity = cities.find((c) => c.id === cityId)

  async function handleGenerate() {
    if (!serviceId || !cityId) {
      alert('Please select both a Service and a City.')
      return
    }
    setStatus('saving')
    const res = await fetch('/api/admin/service-city', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId,
        cityId,
        metaTitle: pageTitle,
        metaDescription,
        heroHeading,
        introText,
      }),
    })
    setStatus(res.ok ? 'saved' : 'error')
  }

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1b1b23]">
      <div className="mx-auto flex min-h-screen w-full flex-col overflow-hidden lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full border-b border-[#c7c4d7] bg-[#FCFBFF] px-4 py-6 lg:w-[280px] lg:border-b-0 lg:border-r lg:px-3 lg:py-5">
          <div className="px-4 py-2">
            <h2 className="text-[20px] font-bold tracking-[-0.2px] text-[#4648d4]">SEO Engine</h2>
          </div>
          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = item.label === 'Content Library'
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-[14px] font-semibold transition ${
                    active
                      ? 'border-r-[4px] border-[#4F46E5] bg-[#ECE8FF] text-[#4F46E5]'
                      : 'text-[#464554] hover:bg-white/80'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-[#4F46E5]' : 'text-[#5B5B6B]'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <header className="border-b border-[#E4E2F0] bg-[#FCFBFF] px-8 py-5">
            <div className="flex items-center justify-between">
              <h1 className="text-[18px] font-semibold">Content Library</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Clock3 className="h-4 w-4" />
                  <span>Editing new page</span>
                </div>
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E2F0] bg-white">
                  <Bell className="h-4 w-4 text-[#6B7280]" />
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-4 sm:px-6 lg:px-6 lg:py-6">
            {/* Service + City selectors */}
            <section className="rounded-2xl border border-[#E4E2F0] bg-white p-6 shadow-sm">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#464554]">Select Service</label>
                  <div className="relative">
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full appearance-none rounded-xl border border-[#c7c4d7] bg-white px-4 py-3 text-[16px] font-medium text-[#1b1b23]"
                    >
                      <option value="">Choose a service...</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#464554]">Select City</label>
                  <div className="relative">
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full appearance-none rounded-xl border border-[#c7c4d7] bg-white px-4 py-3 text-[16px] font-medium text-[#1b1b23]"
                    >
                      <option value="">Choose a city...</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <MapPin className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              {/* Content Parameters */}
              <div className="rounded-[12px] border border-[#c7c4d7] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                    <FileText className="h-5 w-5 text-[#4F46E5]" />
                  </div>
                  <h2 className="text-[14px] font-semibold text-[#1b1b23]">Content Parameters</h2>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-semibold text-[#1b1b23]">Page Title</label>
                      <span className="text-[10px] font-bold text-[#464554]">{pageTitle.length}/60</span>
                    </div>
                    <input
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      maxLength={60}
                      placeholder="e.g. Best Website Development in Jaipur"
                      className="w-full rounded-[8px] border border-[#c7c4d7] bg-white px-4 py-3 text-base text-[#1b1b23] placeholder:text-[#9ca3af]"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-semibold text-[#1b1b23]">Meta Description</label>
                      <span className="text-[10px] font-bold text-[#464554]">{metaDescription.length}/160</span>
                    </div>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      maxLength={160}
                      placeholder="Describe the service and the value proposition..."
                      className="min-h-[120px] w-full rounded-[8px] border border-[#c7c4d7] bg-white px-4 py-3 text-base leading-7 text-[#1b1b23] placeholder:text-[#9ca3af]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1b1b23]">Hero Heading</label>
                    <input
                      value={heroHeading}
                      onChange={(e) => setHeroHeading(e.target.value)}
                      placeholder="Empowering Your Business in Jaipur"
                      className="w-full rounded-[8px] border border-[#c7c4d7] bg-white px-4 py-3 text-base text-[#1b1b23] placeholder:text-[#9ca3af]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1b1b23]">Introduction Text</label>
                    <textarea
                      value={introText}
                      onChange={(e) => setIntroText(e.target.value)}
                      placeholder="Craft a compelling narrative for your local audience..."
                      className="min-h-[120px] w-full rounded-[8px] border border-[#c7c4d7] bg-white px-4 py-3 text-base leading-7 text-[#1b1b23] placeholder:text-[#9ca3af]"
                    />
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div className="rounded-[12px] border border-[#c7c4d7] bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.7px] text-[#464554]">
                    SERP snippet preview
                  </h3>
                  <div className="mt-4 rounded-[8px] border border-[#c7c4d7]/50 bg-[#f5f2fe] p-4">
                    <p className="text-[11px] text-[#464554]">
                      www.abctechnologies.com &gt; services
                    </p>
                    <h4 className="mt-3 text-[18px] font-medium text-[#1a0dab]">
                      {pageTitle || `${selectedService?.name || 'Service'} in ${selectedCity?.name || 'City'}`}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[#4d5156]">
                      {metaDescription || 'Your meta description will appear here as you type.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-[12px] border border-[#c7c4d7] bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="text-[20px] font-semibold text-[#1b1b23]">Content Modules</h3>
                  <div className="mt-4 space-y-3">
                    <button
                      onClick={() => setIncludeFaqs(!includeFaqs)}
                      className="flex w-full items-center justify-between rounded-[8px] border border-[#c7c4d7]/40 bg-[#f5f2fe] px-4 py-3"
                    >
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#1b1b23]">Include FAQs</p>
                        <p className="text-[11px] text-[#464554]">Schema-ready questions</p>
                      </div>
                      <div className={`h-6 w-11 rounded-full transition ${includeFaqs ? 'bg-[#4648d4]' : 'bg-[#c7c4d7]'}`}>
                        <div className={`mt-1 h-4 w-4 rounded-full bg-white transition ${includeFaqs ? 'ml-6' : 'ml-1'}`} />
                      </div>
                    </button>

                    <button
                      onClick={() => setIncludeTestimonials(!includeTestimonials)}
                      className="flex w-full items-center justify-between rounded-[8px] border border-[#c7c4d7]/40 bg-[#f5f2fe] px-4 py-3"
                    >
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#1b1b23]">Include Testimonials</p>
                        <p className="text-[11px] text-[#464554]">Social proof from clients</p>
                      </div>
                      <div className={`h-6 w-11 rounded-full transition ${includeTestimonials ? 'bg-[#4648d4]' : 'bg-[#c7c4d7]'}`}>
                        <div className={`mt-1 h-4 w-4 rounded-full bg-white transition ${includeTestimonials ? 'ml-6' : 'ml-1'}`} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer action bar */}
          <div className="px-4 pb-6 sm:px-6 lg:px-6">
            <div className="flex flex-col gap-4 rounded-[12px] border border-[#c7c4d7] bg-white/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between lg:px-6">
              <div>
                <p className="text-sm font-semibold text-[#1b1b23]">
                  Status: {status === 'saved' ? 'Published' : 'Draft'}
                </p>
                <p className="text-sm text-[#464554]">
                  {status === 'saved' && selectedService && selectedCity
                    ? `Live at /services/${selectedService.name.toLowerCase().replace(/\s+/g, '-')}/${selectedCity.name.toLowerCase()}`
                    : 'Ready to Launch?'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  disabled={status === 'saving'}
                  className="rounded-[8px] border border-[#c7c4d7] bg-white px-5 py-3 text-sm font-semibold text-[#1b1b23] hover:bg-[#f5f2fe]"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={status === 'saving'}
                  className="rounded-[8px] bg-[#4648d4] px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#383bcf] disabled:opacity-60"
                >
                  {status === 'saving' ? 'Generating...' : 'Generate Page'}
                </button>
              </div>
            </div>
            {status === 'error' && (
              <p className="mt-2 text-sm text-red-600">Something went wrong — check the console.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}