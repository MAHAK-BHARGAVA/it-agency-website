import type { LeadStatus } from "@/generated/prisma/client";

type Props = {
  status: LeadStatus;
};

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-blue-200 bg-blue-50 text-blue-700",
  CONTACTED: "border-violet-200 bg-violet-50 text-violet-700",
  MEETING_SCHEDULED:
    "border-amber-200 bg-amber-50 text-amber-700",
  PROPOSAL_SENT:
    "border-orange-200 bg-orange-50 text-orange-700",
  WON: "border-emerald-200 bg-emerald-50 text-emerald-700",
  LOST: "border-slate-200 bg-slate-100 text-slate-600",
  SPAM: "border-red-200 bg-red-50 text-red-700",
};

const statusLabels: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  MEETING_SCHEDULED: "Meeting Scheduled",
  PROPOSAL_SENT: "Proposal Sent",
  WON: "Won",
  LOST: "Lost",
  SPAM: "Spam",
};

export default function LeadStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}