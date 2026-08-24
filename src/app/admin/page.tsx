import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  // Globe,
  // Building2,
  // FileText,
  // ImageIcon,
  Sparkles,
  Bell,
  Briefcase,
  MapPin,
  Mail,
  Plus,
} from "lucide-react";


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
  <div>
    {/* PAGE HEADING */}
    <div className="mb-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
        Overview
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">
        Dashboard
      </h1>

      <p className="mt-2 text-sm text-black/50">
        Monitor enquiries, follow-ups and your sales pipeline.
      </p>
    </div>

    {/* STAT CARDS */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-[24px] border border-black/5 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-black/45">
                  {stat.label}
                </p>

                <p className="mt-4 text-4xl font-black text-black">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}
              >
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* RECENT LEADS + QUICK ACTIONS */}
    <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* Recent Leads */}
      <div className="overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm xl:col-span-2">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-black">
              Recent Leads
            </h2>

            <p className="mt-1 text-sm text-black/40">
              Latest website enquiries
            </p>
          </div>

          <Link
            href="/admin/leads"
            className="text-sm font-bold text-[#4648d4] transition hover:text-[#393bc7]"
          >
            View all
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="px-6 py-14 text-center text-sm text-black/40">
            No leads yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="bg-[#f8f8f5] text-left">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-black/40">
                    Name
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-black/40">
                    Service
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-black/40">
                    City
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-black/40">
                    Received
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-black/40">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-t border-black/5 transition hover:bg-black/[0.015]"
                  >
                    <td className="px-6 py-5 font-bold text-black">
                      {lead.name}
                    </td>

                    <td className="px-6 py-5 text-sm text-black/60">
                      {lead.service?.name ?? "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-black/60">
                      {lead.city ?? "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-black/45">
                      {lead.createdAt.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-sm font-bold text-[#4648d4] hover:text-[#393bc7]"
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

      {/* Quick Actions */}
      <div className="rounded-[26px] bg-[#111111] p-6 text-white shadow-sm">
        <h2 className="text-xl font-black">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-white/45">
          Jump to frequently used tools
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/admin/content-library"
            className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-lime-400 hover:text-black"
          >
            <Plus size={17} />
            Generate a Page
          </Link>

          <Link
            href="/admin/business-targets"
            className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-lime-400 hover:text-black"
          >
            <Plus size={17} />
            Add Service / Industry
          </Link>

          <Link
            href="/admin/cities"
            className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-lime-400 hover:text-black"
          >
            <MapPin size={17} />
            Add City / State
          </Link>

          <div className="my-4 border-t border-white/10" />

          <Link
            href="/admin/leads"
            className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-lime-400 hover:text-black"
          >
            <span className="flex items-center gap-3">
              <Mail size={17} />
              View All Leads
            </span>

            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {totalLeadCount}
            </span>
          </Link>

          <Link
            href="/admin/leads?followUp=overdue"
            className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-red-500/20 hover:text-red-300"
          >
            <span className="flex items-center gap-3">
              <Bell size={17} />
              Overdue Follow-ups
            </span>

            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-300">
              {overdueCount}
            </span>
          </Link>

          <Link
            href="/admin/leads?followUp=due-today"
            className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-amber-500/20 hover:text-amber-300"
          >
            <span className="flex items-center gap-3">
              <Bell size={17} />
              Due Today
            </span>

            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
              {dueTodayCount}
            </span>
          </Link>
        </div>
      </div>
    </div>

    {/* LEAD PIPELINE */}
    <div className="mt-8 rounded-[26px] border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-black">
            Lead Pipeline
          </h2>

          <p className="mt-1 text-sm text-black/45">
            Track leads through every stage of your sales process.
          </p>
        </div>

        <Link
          href="/admin/leads"
          className="text-sm font-bold text-[#4648d4] transition hover:text-[#393bc7]"
        >
          View all leads
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {pipeline.map((item) => (
          <Link
            key={item.status}
            href={`/admin/leads?status=${item.status}`}
            className="group rounded-2xl border border-black/5 bg-[#f8f8f5] p-4 transition hover:-translate-y-1 hover:border-lime-400 hover:bg-white"
          >
            <p className="text-xs font-bold text-black/40">
              {item.label}
            </p>

            <p className="mt-2 text-2xl font-black text-black transition group-hover:text-lime-600">
              {item.count}
            </p>
          </Link>
        ))}
      </div>
    </div>
  </div>
);
}
