"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@/generated/prisma/client";

import AdminButton from "@/components/admin/UI/AdminButton";
import AdminCard from "@/components/admin/UI/AdminCard";

type Props = {
  leadId: number;
  currentStatus: LeadStatus;
  currentNotes: string;
};

const statusOptions: {
  value: LeadStatus;
  label: string;
}[] = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  {
    value: "MEETING_SCHEDULED",
    label: "Meeting Scheduled",
  },
  {
    value: "PROPOSAL_SENT",
    label: "Proposal Sent",
  },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
  { value: "SPAM", label: "Spam" },
];

export default function LeadUpdateForm({
  leadId,
  currentStatus,
  currentNotes,
}: Props) {
  const router = useRouter();

  const [status, setStatus] =
    useState<LeadStatus>(currentStatus);

  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update the lead.",
        );
      }

      setMessage("Lead updated successfully.");
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminCard className="p-6">
      <h2 className="text-lg font-semibold text-[#1b1b23]">
        Manage lead
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#6b7280]">
        Update the sales stage and keep internal follow-up notes.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-semibold text-[#262631]"
          >
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as LeadStatus)
            }
            className="h-12 w-full rounded-xl border border-[#d8d5e4] bg-white px-4 text-sm font-medium text-[#353541] outline-none transition focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10"
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="notes"
              className="text-sm font-semibold text-[#262631]"
            >
              Internal notes
            </label>

            <span className="text-xs text-[#8b8998]">
              {notes.length}/3000
            </span>
          </div>

          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={3000}
            placeholder="Add call notes, meeting details, proposal updates or follow-up reminders..."
            className="min-h-[220px] w-full resize-y rounded-xl border border-[#d8d5e4] bg-[#fbfaff] px-4 py-3 text-sm leading-7 text-[#353541] outline-none transition placeholder:text-[#aaa8b7] focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
          />
        </div>

        {message && (
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}

        <AdminButton
          type="submit"
          disabled={saving}
          className="w-full"
        >
          {saving ? "Saving..." : "Save changes"}
        </AdminButton>
      </form>
    </AdminCard>
  );
}