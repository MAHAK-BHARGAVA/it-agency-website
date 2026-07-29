import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Globe,
  Building2,
  FileText,
  ImageIcon,
  Sparkles,
  Bell,
  Briefcase,
  MapPin,
  Mail,
  Plus,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: null, href: '/admin' },
  { label: 'Geographic Targets', icon: Globe, href: '/admin/cities' },
  { label: 'Business Targets', icon: Building2, href: '/admin/business-targets' },
  { label: 'Content Library', icon: FileText, href: '/admin/content-library' },
  { label: 'Media', icon: ImageIcon, href: '/admin/portfolio' },
  { label: 'Optimization', icon: Sparkles, href: '/admin/faqs' },
]

export default async function AdminDashboardPage() {
  const [serviceCount, cityCount, industryCount, leadCount, recentLeads] = await Promise.all([
    prisma.service.count(),
    prisma.city.count(),
    prisma.industry.count(),
    prisma.lead.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { service: true },
    }),
  ])

  const stats = [
    { label: 'Total Services', value: serviceCount, icon: Briefcase, color: 'bg-[#EEF2FF] text-[#4F46E5]' },
    { label: 'Total Cities', value: cityCount, icon: MapPin, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Industries', value: industryCount, icon: Building2, color: 'bg-amber-50 text-amber-600' },
    { label: 'New Leads', value: leadCount, icon: Mail, color: 'bg-rose-50 text-rose-600' },
  ]

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
              const active = item.label === 'Dashboard'
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
                  {Icon ? (
                    <Icon className={`h-5 w-5 ${active ? 'text-[#4F46E5]' : 'text-[#5B5B6B]'}`} />
                  ) : (
                    <span className="h-5 w-5 rounded bg-[#4F46E5]" />
                  )}
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
              <h1 className="text-[18px] font-semibold">Dashboard</h1>
              <div className="flex items-center gap-6">
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E2F0] bg-white">
                  <Bell className="h-4 w-4 text-[#6B7280]" />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-semibold text-white">
                  AD
                </div>
              </div>
            </div>
          </header>

          <main className="px-8 py-6">
            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-2xl border border-[#E4E2F0] bg-white p-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg mb-3 ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-sm text-[#6B7280]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#1b1b23]">{stat.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Recent activity + quick actions */}
            <div className="mt-6 grid grid-cols-3 gap-6">
              <div className="col-span-2 rounded-2xl border border-[#E4E2F0] bg-white p-6">
                <h2 className="font-semibold text-[#1b1b23] mb-4">Recent Leads</h2>
                {recentLeads.length === 0 ? (
                  <p className="text-sm text-[#6B7280]">
                    No leads yet — they&apos;ll appear here once the contact form is submitted.
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[#6B7280] border-b border-[#F1F0F7]">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Service</th>
                        <th className="pb-2">City</th>
                        <th className="pb-2">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((lead) => (
                        <tr key={lead.id} className="border-b border-[#F8F7FF]">
                          <td className="py-3 font-medium text-[#1b1b23]">{lead.name}</td>
                          <td className="py-3 text-[#6B7280]">{lead.service?.name || '—'}</td>
                          <td className="py-3 text-[#6B7280]">{lead.city || '—'}</td>
                          <td className="py-3 text-[#9ca3af]">
                            {lead.createdAt.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="rounded-2xl bg-[#4648d4] p-6 text-white">
                <h2 className="font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Link
                    href="/admin/content-library"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2.5 text-sm font-medium transition"
                  >
                    <Plus size={16} /> Generate a Page
                  </Link>
                  <Link
                    href="/admin/business-targets"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2.5 text-sm font-medium transition"
                  >
                    <Plus size={16} /> Add Service / Industry
                  </Link>
                  <Link
                    href="/admin/cities"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2.5 text-sm font-medium transition"
                  >
                    <Plus size={16} /> Add City / State
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}