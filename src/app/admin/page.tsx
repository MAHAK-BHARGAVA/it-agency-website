import { prisma } from "@/lib/prisma";
import Link from "next/link";
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
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: null,
    href: "/admin",
  },
  {
    label: "Geographic Targets",
    icon: Globe,
    href: "/admin/cities",
  },
  {
    label: "Business Targets",
    icon: Building2,
    href: "/admin/business-targets",
  },
  {
    label: "Content Library",
    icon: FileText,
    href: "/admin/content-library",
  },
  {
    label: "Media",
    icon: ImageIcon,
    href: "/admin/portfolio",
  },
  {
    label: "Optimization",
    icon: Sparkles,
    href: "/admin/faqs",
  },
];

export default async function AdminDashboardPage() {
  // --------------------------------------------------
  // DATE CALCULATIONS
  // --------------------------------------------------

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  // --------------------------------------------------
  // DASHBOARD DATA
  // --------------------------------------------------

  const [
    totalLeadCount,
    newLeadCount,
    wonLeadCount,
    pendingFollowUpCount,
    dueTodayCount,
    overdueCount,
    recentLeads,
    pipelineGroups,
  ] = await Promise.all([
    // Total Leads
    prisma.lead.count(),

    // New Leads
    prisma.lead.count({
      where: {
        status: "NEW",
      },
    }),

    // Won Leads
    prisma.lead.count({
      where: {
        status: "WON",
      },
    }),

    // All Pending Follow-ups
    prisma.leadFollowUp.count({
      where: {
        status: "PENDING",
      },
    }),

    // Follow-ups Due Today
    prisma.leadFollowUp.count({
      where: {
        status: "PENDING",
        scheduledAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    // Overdue Follow-ups
    prisma.leadFollowUp.count({
      where: {
        status: "PENDING",
        scheduledAt: {
          lt: startOfToday,
        },
      },
    }),

    // Recent Leads
    prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        service: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    }),
  ]);

  const pipelineCount = Object.fromEntries(
    pipelineGroups.map((item) => [item.status, item._count.id]),
  );

  const pipeline = [
    {
      label: "New",
      status: "NEW",
      count: pipelineCount.NEW ?? 0,
    },
    {
      label: "Contacted",
      status: "CONTACTED",
      count: pipelineCount.CONTACTED ?? 0,
    },
    {
      label: "Qualified",
      status: "QUALIFIED",
      count: pipelineCount.QUALIFIED ?? 0,
    },
    {
      label: "Meeting Scheduled",
      status: "MEETING_SCHEDULED",
      count: pipelineCount.MEETING_SCHEDULED ?? 0,
    },
    {
      label: "Proposal Sent",
      status: "PROPOSAL_SENT",
      count: pipelineCount.PROPOSAL_SENT ?? 0,
    },
    {
      label: "Negotiation",
      status: "NEGOTIATION",
      count: pipelineCount.NEGOTIATION ?? 0,
    },
    {
      label: "Won",
      status: "WON",
      count: pipelineCount.WON ?? 0,
    },
    {
      label: "Lost",
      status: "LOST",
      count: pipelineCount.LOST ?? 0,
    },
  ];

  // --------------------------------------------------
  // DASHBOARD STATS
  // --------------------------------------------------

  const stats = [
    {
      label: "Total Leads",
      value: totalLeadCount,
      icon: Mail,
      color: "bg-[#EEF2FF] text-[#4F46E5]",
    },
    {
      label: "New Leads",
      value: newLeadCount,
      icon: Sparkles,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Won Leads",
      value: wonLeadCount,
      icon: Briefcase,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Pending Follow-ups",
      value: pendingFollowUpCount,
      icon: Bell,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1b1b23]">
      <div className="mx-auto flex min-h-screen w-full flex-col overflow-hidden lg:flex-row">
        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="w-full border-b border-[#c7c4d7] bg-[#FCFBFF] px-4 py-6 lg:w-[280px] lg:border-b-0 lg:border-r lg:px-3 lg:py-5">
          <div className="px-4 py-2">
            <h2 className="text-[20px] font-bold tracking-[-0.2px] text-[#4648d4]">
              SEO Engine
            </h2>
          </div>

          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.label === "Dashboard";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-[14px] font-semibold transition ${
                    active
                      ? "border-r-[4px] border-[#4F46E5] bg-[#ECE8FF] text-[#4F46E5]"
                      : "text-[#464554] hover:bg-white/80"
                  }`}
                >
                  {Icon ? (
                    <Icon
                      className={`h-5 w-5 ${
                        active ? "text-[#4F46E5]" : "text-[#5B5B6B]"
                      }`}
                    />
                  ) : (
                    <span className="h-5 w-5 rounded bg-[#4F46E5]" />
                  )}

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="flex-1">
          {/* Header */}

          <header className="border-b border-[#E4E2F0] bg-[#FCFBFF] px-8 py-5">
            <div className="flex items-center justify-between">
              <h1 className="text-[18px] font-semibold">Dashboard</h1>

              <div className="flex items-center gap-6">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E2F0] bg-white"
                >
                  <Bell className="h-4 w-4 text-[#6B7280]" />
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-semibold text-white">
                  AD
                </div>
              </div>
            </div>
          </header>

          {/* ==================================================
              PAGE CONTENT
          ================================================== */}

          <main className="px-8 py-6">
            {/* ==================================================
                STAT CARDS
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[#E4E2F0] bg-white p-5"
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                    >
                      <Icon size={20} />
                    </div>

                    <p className="text-sm text-[#6B7280]">{stat.label}</p>

                    <p className="text-2xl font-bold text-[#1b1b23]">
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* ==================================================
                RECENT LEADS + QUICK ACTIONS
            ================================================== */}

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
              {/* ==============================
                  RECENT LEADS
              ============================== */}

              <div className="rounded-2xl border border-[#E4E2F0] bg-white p-6 xl:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-[#1b1b23]">Recent Leads</h2>

                  <Link
                    href="/admin/leads"
                    className="text-sm font-semibold text-[#4648d4] transition hover:text-[#393bc7]"
                  >
                    View all
                  </Link>
                </div>

                {recentLeads.length === 0 ? (
                  <p className="text-sm text-[#6B7280]">
                    No leads yet — they&apos;ll appear here once the contact
                    form is submitted.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-sm">
                      <thead>
                        <tr className="border-b border-[#F1F0F7] text-left text-[#6B7280]">
                          <th className="pb-2">Name</th>

                          <th className="pb-2">Service</th>

                          <th className="pb-2">City</th>

                          <th className="pb-2">Received</th>

                          <th className="pb-2 text-right">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="border-b border-[#F8F7FF] last:border-b-0"
                          >
                            <td className="py-3 font-medium text-[#1b1b23]">
                              {lead.name}
                            </td>

                            <td className="py-3 text-[#6B7280]">
                              {lead.service?.name || "—"}
                            </td>

                            <td className="py-3 text-[#6B7280]">
                              {lead.city || "—"}
                            </td>

                            <td className="py-3 text-[#9ca3af]">
                              {lead.createdAt.toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            <td className="py-3 text-right">
                              <Link
                                href={`/admin/leads/${lead.id}`}
                                className="text-xs font-semibold text-[#4648d4] hover:text-[#393bc7]"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ==============================
                  QUICK ACTIONS
              ============================== */}

              <div className="rounded-2xl bg-[#4648d4] p-6 text-white">
                <h2 className="mb-4 font-semibold">Quick Actions</h2>

                <div className="space-y-2">
                  {/* Existing Actions */}

                  <Link
                    href="/admin/content-library"
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/20"
                  >
                    <Plus size={16} />
                    Generate a Page
                  </Link>

                  <Link
                    href="/admin/business-targets"
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/20"
                  >
                    <Plus size={16} />
                    Add Service / Industry
                  </Link>

                  <Link
                    href="/admin/cities"
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/20"
                  >
                    <Plus size={16} />
                    Add City / State
                  </Link>

                  {/* Divider */}

                  <div className="my-4 border-t border-white/20" />

                  {/* Lead Management */}

                  <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wider text-white/60">
                    Lead Management
                  </p>

                  {/* View All Leads */}

                  <Link
                    href="/admin/leads"
                    className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/20"
                  >
                    <span className="flex items-center gap-2">
                      <Mail size={16} />
                      View All Leads
                    </span>

                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                      {totalLeadCount}
                    </span>
                  </Link>

                  {/* Overdue Follow-ups */}

                  <Link
                    href="/admin/leads?followUp=overdue"
                    className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/20"
                  >
                    <span className="flex items-center gap-2">
                      <Bell size={16} />
                      Overdue Follow-ups
                    </span>

                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-red-600">
                      {overdueCount}
                    </span>
                  </Link>

                  {/* Due Today */}

                  <Link
                    href="/admin/leads?followUp=due-today"
                    className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/20"
                  >
                    <span className="flex items-center gap-2">
                      <Bell size={16} />
                      Due Today
                    </span>

                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-amber-600">
                      {dueTodayCount}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Lead Pipeline */}
            <div className="mt-6 rounded-2xl border border-[#E4E2F0] bg-white p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-[#1b1b23]">
                    Lead Pipeline
                  </h2>

                  <p className="mt-1 text-sm text-[#6B7280]">
                    Track leads through each stage of your sales process.
                  </p>
                </div>

                <Link
                  href="/admin/leads"
                  className="text-sm font-semibold text-[#4648d4] transition hover:text-[#393bc7]"
                >
                  View all leads
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
                {pipeline.map((item) => (
                  <Link
                    key={item.status}
                    href={`/admin/leads?status=${item.status}`}
                    className="group rounded-xl border border-[#E8E6F0] bg-[#FCFBFF] p-4 transition hover:border-[#6466e8] hover:bg-[#F7F5FF]"
                  >
                    <p className="text-xs font-semibold text-[#777584]">
                      {item.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#1b1b23] transition group-hover:text-[#4648d4]">
                      {item.count}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
