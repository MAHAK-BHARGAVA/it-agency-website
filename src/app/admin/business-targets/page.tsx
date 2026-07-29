'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Globe,
  Building2,
  FileText,
  ImageIcon,
  Sparkles,
  Search,
  Plus,
  MoreVertical,
  CheckCircle2,
  Circle,
} from 'lucide-react'

type Service = {
  id: number
  name: string
  slug: string
  description: string
  _count: { serviceCities: number; serviceStates: number; serviceIndustries: number }
}

type Industry = {
  id: number
  name: string
  slug: string
  description: string
  _count: { serviceIndustries: number }
}

const navItems = [
  { label: 'Geographic Targets', icon: Globe, href: '/admin/cities' },
  { label: 'Business Targets', icon: Building2, href: '/admin/business-targets' },
  { label: 'Content Library', icon: FileText, href: '/admin/content-library' },
  { label: 'Media', icon: ImageIcon, href: '/admin/portfolio' },
  { label: 'Optimization', icon: Sparkles, href: '/admin/faqs' },
]

export default function BusinessTargetsPage() {
  const [tab, setTab] = useState<'services' | 'industries'>('services')
  const [services, setServices] = useState<Service[]>([])
  const [industries, setIndustries] = useState<Industry[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  async function loadData() {
    const [s, i] = await Promise.all([
      fetch('/api/admin/services').then((r) => r.json()),
      fetch('/api/admin/industries').then((r) => r.json()),
    ])
    setServices(s)
    setIndustries(i)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleAdd() {
    console.log("handleAdd called");
    console.log(form);
    setSaving(true)
    const endpoint = tab === 'services' ? '/api/admin/services' : '/api/admin/industries'
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setShowModal(false)
    setForm({ name: '', slug: '', description: '' })
    loadData()
  }

  async function handleDelete(kind: 'services' | 'industries', id: number) {
    if (!confirm('Delete this item? This cannot be undone.')) return
    await fetch(`/api/admin/${kind}/${id}`, { method: 'DELETE' })
    loadData()
  }

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )
  const filteredIndustries = industries.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  function totalPages(s: Service) {
    return s._count.serviceCities + s._count.serviceStates + s._count.serviceIndustries
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
              const active = item.label === 'Business Targets'
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
        <div className="flex-1 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[32px] font-bold text-[#1b1b23]">Business Targets</h1>
              <p className="mt-1 text-[15px] text-[#6B7280]">
                Manage the services and industries this site generates pages for.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services or industries..."
                  className="w-72 rounded-xl border border-[#c7c4d7] bg-white py-2.5 pl-9 pr-4 text-sm"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#4648d4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#383bcf]"
              >
                <Plus size={16} /> Add {tab === 'services' ? 'Service' : 'Industry'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-6 border-b border-[#E4E2F0]">
            <button
              onClick={() => setTab('services')}
              className={`pb-3 text-[15px] font-semibold ${
                tab === 'services' ? 'border-b-2 border-[#4648d4] text-[#4648d4]' : 'text-[#6B7280]'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setTab('industries')}
              className={`pb-3 text-[15px] font-semibold ${
                tab === 'industries' ? 'border-b-2 border-[#4648d4] text-[#4648d4]' : 'text-[#6B7280]'
              }`}
            >
              Industries
            </button>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#E4E2F0] bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F7FF] text-[#464554]">
                <tr className="text-left">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  {tab === 'services' && <th className="px-6 py-4 font-semibold">Total Pages</th>}
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tab === 'services'
                  ? filteredServices.map((s) => (
                      <tr key={s.id} className="border-t border-[#F1F0F7]">
                        <td className="px-6 py-4 font-semibold text-[#1b1b23]">{s.name}</td>
                        <td className="px-6 py-4 text-[#6B7280] max-w-xs truncate">{s.description}</td>
                        <td className="px-6 py-4 text-[#1b1b23]">{totalPages(s)}</td>
                        <td className="px-6 py-4">
                          {totalPages(s) > 0 ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                              <CheckCircle2 size={15} /> Live
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                              <Circle size={15} /> No Pages Yet
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete('services', s.id)}
                            className="text-slate-400 hover:text-red-600"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  : filteredIndustries.map((i) => (
                      <tr key={i.id} className="border-t border-[#F1F0F7]">
                        <td className="px-6 py-4 font-semibold text-[#1b1b23]">{i.name}</td>
                        <td className="px-6 py-4 text-[#6B7280] max-w-xs truncate">{i.description}</td>
                        <td className="px-6 py-4">
                          {i._count.serviceIndustries > 0 ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                              <CheckCircle2 size={15} /> Live
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                              <Circle size={15} /> No Pages Yet
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete('industries', i.id)}
                            className="text-slate-400 hover:text-red-600"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Add {tab === 'services' ? 'Service' : 'Industry'}
            </h2>
            <div className="space-y-3">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-[#c7c4d7] px-3 py-2 text-sm"
              />
              <input
                placeholder={`ex-${tab === 'services' ? 'Web-Development' : 'Healthcare'}`}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-lg border border-[#c7c4d7] px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-[#c7c4d7] px-3 py-2 text-sm min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600">
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#4648d4] rounded-lg hover:bg-[#383bcf] disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}