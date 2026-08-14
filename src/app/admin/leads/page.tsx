import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  Search,
  UserPlus,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import AdminCard from "@/components/admin/UI/AdminCard";
import AdminEmptyState from "@/components/admin/UI/AdminEmptyState";
import AdminPageHeader from "@/components/admin/UI/AdminPageHeader";
import LeadStatusBadge from "@/components/admin/leads/LeadStatusBadge";

type Props = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    service?: string;
    followUp?: string;
  }>;
};

export default async function AdminLeadsPage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const service = params.service?.trim() ?? "";
  const followUp = params.followUp?.trim() ?? "";

  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  // Current date/time used for follow-up calculations
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  // Fetch leads
  const leads = await prisma.lead.findMany({
    where: {
      AND: [
        // Search by name or phone
        search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                  },
                },
                {
                  phone: {
                    contains: search,
                  },
                },
              ],
            }
          : {},

        // Lead status
        status
          ? {
              status: status as
                | "NEW"
                | "CONTACTED"
                | "QUALIFIED"
                | "MEETING_SCHEDULED"
                | "PROPOSAL_SENT"
                | "NEGOTIATION"
                | "WON"
                | "LOST"
                | "SPAM",
            }
          : {},

        // Service
        service
          ? {
              serviceId: Number(service),
            }
          : {},

        // Follow-up status
        followUp === "due-today"
          ? {
              followUps: {
                some: {
                  status: "PENDING",
                  scheduledAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                  },
                },
              },
            }
          : followUp === "overdue"
            ? {
                followUps: {
                  some: {
                    status: "PENDING",
                    scheduledAt: {
                      lt: startOfToday,
                    },
                  },
                },
              }
            : followUp === "upcoming"
              ? {
                  followUps: {
                    some: {
                      status: "PENDING",
                      scheduledAt: {
                        gt: endOfToday,
                      },
                    },
                  },
                }
              : followUp === "none"
                ? {
                    followUps: {
                      none: {
                        status: "PENDING",
                      },
                    },
                  }
                : {},
      ],
    },

    include: {
      service: {
        select: {
          name: true,
        },
      },

      // Fetch only the nearest pending follow-up
      followUps: {
        where: {
          status: "PENDING",
        },
        orderBy: {
          scheduledAt: "asc",
        },
        take: 1,
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  // CRM summary counts
  const [newLeadCount, dueTodayCount, overdueCount, upcomingCount] =
    await Promise.all([
      // New leads
      prisma.lead.count({
        where: {
          status: "NEW",
        },
      }),

      // Pending follow-ups scheduled today
      prisma.leadFollowUp.count({
        where: {
          status: "PENDING",
          scheduledAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),

      // Pending follow-ups before today
      prisma.leadFollowUp.count({
        where: {
          status: "PENDING",
          scheduledAt: {
            lt: startOfToday,
          },
        },
      }),

      // Pending follow-ups after today
      prisma.leadFollowUp.count({
        where: {
          status: "PENDING",
          scheduledAt: {
            gt: endOfToday,
          },
        },
      }),
    ]);

  return (
    <main className="px-5 py-7 sm:px-8">
      <AdminPageHeader
        title="Leads"
        description="Review website enquiries, contact prospects and manage each opportunity through the sales pipeline."
      />

      {/* CRM Summary Cards */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="New Leads"
          value={newLeadCount}
          description="Waiting for first action"
          icon={<UserPlus className="h-5 w-5" />}
        />

        <SummaryCard
          title="Due Today"
          value={dueTodayCount}
          description="Follow-ups scheduled today"
          icon={<CalendarClock className="h-5 w-5" />}
        />

        <SummaryCard
          title="Overdue"
          value={overdueCount}
          description="Need immediate attention"
          icon={<AlertTriangle className="h-5 w-5" />}
        />

        <SummaryCard
          title="Upcoming"
          value={upcomingCount}
          description="Future follow-ups"
          icon={<Clock3 className="h-5 w-5" />}
        />
      </div>

      {/* Leads */}
      <AdminCard className="mt-7">
        {/* Filters */}
        <form className="flex flex-col gap-3 border-b border-[#f0eef7] p-5 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b99aa]" />

            <input
              name="search"
              defaultValue={search}
              placeholder="Search by name or phone..."
              className="h-11 w-full rounded-xl border border-[#d8d5e4] bg-[#fbfaff] pl-11 pr-4 text-sm outline-none transition focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
            />
          </div>

          <select
            name="status"
            defaultValue={status}
            className="h-11 rounded-xl border border-[#d8d5e4] bg-white px-4 text-sm font-medium text-[#464554] outline-none focus:border-[#6466e8]"
          >
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
            <option value="PROPOSAL_SENT">Proposal Sent</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
            <option value="SPAM">Spam</option>
          </select>

          <select
            name="service"
            defaultValue={service}
            className="h-11 rounded-xl border border-[#d8d5e4] bg-white px-4 text-sm font-medium text-[#464554] outline-none focus:border-[#6466e8]"
          >
            <option value="">All services</option>

            {services.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            name="followUp"
            defaultValue={followUp}
            className="h-11 rounded-xl border border-[#d8d5e4] bg-white px-4 text-sm font-medium text-[#464554] outline-none focus:border-[#6466e8]"
          >
            <option value="">All follow-ups</option>
            <option value="due-today">Due Today</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Upcoming</option>
            <option value="none">No Follow-up</option>
          </select>

          <button
            type="submit"
            className="h-11 rounded-xl bg-[#4648d4] px-5 text-sm font-semibold text-white transition hover:bg-[#393bc7]"
          >
            Apply filters
          </button>

          {(search || status || service || followUp) && (
            <Link
              href="/admin/leads"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d8d5e4] bg-white px-5 text-sm font-semibold text-[#555462] transition hover:bg-[#f5f2fe]"
            >
              Clear
            </Link>
          )}
        </form>

        {/* Empty state */}
        {leads.length === 0 ? (
          <AdminEmptyState
            icon={<Mail className="h-5 w-5" />}
            title="No leads found"
            description="No enquiries match your current search and status filters."
          />
        ) : (
          /* Leads Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b border-[#f0eef7] bg-[#fbfaff] text-left text-[#6b7280]">
                  <th className="px-6 py-4 font-semibold">Client</th>

                  <th className="px-6 py-4 font-semibold">Service</th>

                  <th className="px-6 py-4 font-semibold">Status</th>

                  <th className="px-6 py-4 font-semibold">Next Follow-up</th>

                  <th className="px-6 py-4 font-semibold">Received</th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => {
                  const whatsappPhone = lead.phone.replace(/\D/g, "");

                  const nextFollowUp = lead.followUps[0];

                  const isOverdue =
                    nextFollowUp && nextFollowUp.scheduledAt < now;

                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-[#f5f3fa] last:border-b-0 hover:bg-[#fcfbff]"
                    >
                      {/* Client */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1b1b23]">
                          {lead.name}
                        </p>

                        <p className="mt-1 text-xs text-[#8b8998]">
                          {lead.phone}
                        </p>
                      </td>

                      {/* Service */}
                      <td className="px-6 py-4 text-[#555462]">
                        {lead.service?.name ?? "—"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <LeadStatusBadge status={lead.status} />
                      </td>

                      {/* Next Follow-up */}
                      <td className="px-6 py-4">
                        {nextFollowUp ? (
                          <div>
                            <p className="font-medium text-[#555462]">
                              {nextFollowUp.title}
                            </p>

                            <p
                              className={`mt-1 text-xs ${
                                isOverdue
                                  ? "font-semibold text-red-600"
                                  : "text-[#8b8998]"
                              }`}
                            >
                              {nextFollowUp.scheduledAt.toLocaleString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>

                            {isOverdue && (
                              <span className="mt-1 inline-block rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                                Overdue
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#aaa8b5]">—</span>
                        )}
                      </td>

                      {/* Received */}
                      <td className="px-6 py-4 text-[#777584]">
                        {lead.createdAt.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`tel:${lead.phone}`}
                            title="Call client"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e2f0] bg-white text-[#6b7280] transition hover:border-[#6466e8] hover:text-[#4648d4]"
                          >
                            <Phone className="h-4 w-4" />
                          </a>

                          <a
                            href={`https://wa.me/${whatsappPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Open WhatsApp"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e2f0] bg-white text-[#6b7280] transition hover:border-emerald-300 hover:text-emerald-600"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>

                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#ece8ff] px-4 text-xs font-semibold text-[#4648d4] transition hover:bg-[#dfd9ff]"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Summary Card                                  */
/* -------------------------------------------------------------------------- */

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <AdminCard className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#777584]">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-[-0.03em] text-[#1b1b23]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece8ff] text-[#4648d4]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-[#8b8998]">{description}</p>
    </AdminCard>
  );
}
