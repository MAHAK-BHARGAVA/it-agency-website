import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Phone,
  Search,
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
  }>;
};

export default async function AdminLeadsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status?.trim() ?? "";

  const leads = await prisma.lead.findMany({
    where: {
      AND: [
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
        status
          ? {
              status: status as
                | "NEW"
                | "CONTACTED"
                | "MEETING_SCHEDULED"
                | "PROPOSAL_SENT"
                | "WON"
                | "LOST"
                | "SPAM",
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="px-5 py-7 sm:px-8">
      <AdminPageHeader
        title="Leads"
        description="Review website enquiries, contact prospects and manage each opportunity through the sales pipeline."
      />

      <AdminCard className="mt-7">
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
            <option value="MEETING_SCHEDULED">
              Meeting Scheduled
            </option>
            <option value="PROPOSAL_SENT">
              Proposal Sent
            </option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
            <option value="SPAM">Spam</option>
          </select>

          <button
            type="submit"
            className="h-11 rounded-xl bg-[#4648d4] px-5 text-sm font-semibold text-white transition hover:bg-[#393bc7]"
          >
            Apply filters
          </button>

          {(search || status) && (
            <Link
              href="/admin/leads"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d8d5e4] bg-white px-5 text-sm font-semibold text-[#555462] transition hover:bg-[#f5f2fe]"
            >
              Clear
            </Link>
          )}
        </form>

        {leads.length === 0 ? (
          <AdminEmptyState
            icon={<Mail className="h-5 w-5" />}
            title="No leads found"
            description="No enquiries match your current search and status filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="border-b border-[#f0eef7] bg-[#fbfaff] text-left text-[#6b7280]">
                  <th className="px-6 py-4 font-semibold">
                    Client
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Service
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Preferred Start
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Received
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => {
                  const whatsappPhone = lead.phone.replace(/\D/g, "");

                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-[#f5f3fa] last:border-b-0 hover:bg-[#fcfbff]"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1b1b23]">
                          {lead.name}
                        </p>

                        <p className="mt-1 text-xs text-[#8b8998]">
                          {lead.phone}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-[#555462]">
                        {lead.service?.name ?? "—"}
                      </td>

                      <td className="px-6 py-4 text-[#555462]">
                        {lead.preferredStartTime ?? "—"}
                      </td>

                      <td className="px-6 py-4">
                        <LeadStatusBadge status={lead.status} />
                      </td>

                      <td className="px-6 py-4 text-[#777584]">
                        {lead.createdAt.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

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