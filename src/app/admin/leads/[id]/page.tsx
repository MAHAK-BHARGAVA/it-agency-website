import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";

import { prisma } from "@/lib/prisma";
import AdminCard from "@/components/admin/UI/AdminCard";
import LeadStatusBadge from "@/components/admin/leads/LeadStatusBadge";
import LeadUpdateForm from "@/components/admin/leads/LeadUpdateForm";
import LeadActivityTimeline from "@/components/admin/leads/LeadActivityTimeline";
import ScheduleFollowUpForm from "@/components/admin/leads/ScheduleFollowUpForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadDetailsPage({ params }: Props) {
  const { id } = await params;
  const leadId = Number(id);

  if (!Number.isInteger(leadId) || leadId <= 0) {
    notFound();
  }

  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
    include: {
      service: {
        select: {
          name: true,
        },
      },
      activities: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      followUps: {
        orderBy: {
          scheduledAt: "asc",
        },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  const whatsappPhone = lead.phone.replace(/\D/g, "");

  return (
    <main className="px-5 py-7 sm:px-8">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6466e8] transition hover:text-[#393bc7]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#1b1b23]">
              {lead.name}
            </h1>

            <LeadStatusBadge status={lead.status} />
          </div>

          <p className="mt-2 text-sm text-[#6b7280]">
            Lead #{lead.id} · Received{" "}
            {lead.createdAt.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${lead.phone}`}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d8d5e4] bg-white px-4 text-sm font-semibold text-[#555462] transition hover:border-[#6466e8] hover:text-[#4648d4]"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>

          <a
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d8d5e4] bg-white px-4 text-sm font-semibold text-[#555462] transition hover:border-[#6466e8] hover:text-[#4648d4]"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}
        </div>
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <AdminCard className="p-6">
          <h2 className="text-lg font-semibold text-[#1b1b23]">
            Lead information
          </h2>

          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <InfoItem label="Client name" value={lead.name} />
            <InfoItem label="Phone" value={lead.phone} />
            <InfoItem label="Email" value={lead.email ?? "Not provided"} />
            <InfoItem
              label="Service"
              value={lead.service?.name ?? "Not selected"}
            />
            <InfoItem
              label="Preferred start"
              value={lead.preferredStartTime ?? "Not provided"}
            />
            <InfoItem label="Source" value={lead.source ?? "Website"} />
            <InfoItem label="City" value={lead.city ?? "Not provided"} />
            <InfoItem
              label="Last updated"
              value={lead.updatedAt.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </dl>

          {lead.message && (
            <div className="mt-7 border-t border-[#f0eef7] pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8b8998]">
                Client message
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#555462]">
                {lead.message}
              </p>
            </div>
          )}
        </AdminCard>

        <LeadUpdateForm
          leadId={lead.id}
          currentStatus={lead.status}
          currentNotes={lead.notes ?? ""}
        />
      </div>

      <div className="mt-6">
        <ScheduleFollowUpForm leadId={lead.id} />
      </div>
      
      {/* Activity Timeline */}
      <div className="mt-6">
        <LeadActivityTimeline
          activities={lead.activities}
          leadCreatedAt={lead.createdAt}
        />
      </div>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#8b8998]">
        {label}
      </dt>

      <dd className="mt-2 text-sm font-semibold text-[#1b1b23]">{value}</dd>
    </div>
  );
}
