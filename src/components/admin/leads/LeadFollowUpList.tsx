"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import type { FollowUpStatus } from "@/generated/prisma/client";
import AdminCard from "@/components/admin/UI/AdminCard";

type FollowUp = {
  id: number;
  title: string;
  description: string | null;
  scheduledAt: Date;
  completedAt: Date | null;
  status: FollowUpStatus;
};

type Props = {
  leadId: number;
  followUps: FollowUp[];
};

export default function LeadFollowUpList({
  leadId,
  followUps,
}: Props) {
  const router = useRouter();

  const [updatingId, setUpdatingId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");

  async function updateFollowUp(
    followUpId: number,
    status: "COMPLETED" | "CANCELLED",
  ) {
    setUpdatingId(followUpId);
    setError("");

    try {
      const response = await fetch(
  `/api/admin/leads/${leadId}/follow-ups/${followUpId}`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update follow-up.",
        );
      }

      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Something went wrong.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminCard className="p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece8ff] text-[#4648d4]">
          <CalendarClock className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#1b1b23]">
            Follow-ups
          </h2>

          <p className="mt-1 text-sm text-[#6b7280]">
            Track upcoming, completed and overdue follow-ups.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {followUps.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm font-semibold text-[#454451]">
            No follow-ups scheduled
          </p>

          <p className="mt-2 text-sm text-[#8b8998]">
            Schedule a follow-up using the form above.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {followUps.map((followUp) => {
            const isOverdue =
              followUp.status === "PENDING" &&
              followUp.scheduledAt < new Date();

            return (
              <article
                key={followUp.id}
                className="rounded-2xl border border-[#e7e4ef] bg-[#fbfaff] p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[#1b1b23]">
                        {followUp.title}
                      </h3>

                      <FollowUpBadge
                        status={followUp.status}
                        overdue={isOverdue}
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-[#666473]">
                      <Clock3 className="h-4 w-4 text-[#777584]" />

                      {followUp.scheduledAt.toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>

                    {followUp.description && (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#666473]">
                        {followUp.description}
                      </p>
                    )}

                    {followUp.completedAt && (
                      <p className="mt-3 text-xs text-[#8b8998]">
                        Completed on{" "}
                        {followUp.completedAt.toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    )}
                  </div>

                  {followUp.status === "PENDING" && (
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={updatingId === followUp.id}
                        onClick={() =>
                          updateFollowUp(
                            followUp.id,
                            "COMPLETED",
                          )
                        }
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === followUp.id}
                        onClick={() =>
                          updateFollowUp(
                            followUp.id,
                            "CANCELLED",
                          )
                        }
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminCard>
  );
}

function FollowUpBadge({
  status,
  overdue,
}: {
  status: FollowUpStatus;
  overdue: boolean;
}) {
  if (overdue) {
    return (
      <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
        Overdue
      </span>
    );
  }

  const styles: Record<FollowUpStatus, string> = {
    PENDING:
      "border-blue-200 bg-blue-50 text-blue-700",
    COMPLETED:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELLED:
      "border-slate-200 bg-slate-100 text-slate-600",
  };

  const labels: Record<FollowUpStatus, string> = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}