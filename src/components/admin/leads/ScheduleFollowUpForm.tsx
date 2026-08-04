"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import {
  CalendarPlus,
  Clock3,
  FileText,
  MonitorPlay,
  Phone,
  Presentation,
  Users,
} from "lucide-react";

import AdminButton from "@/components/admin/UI/AdminButton";
import AdminCard from "@/components/admin/UI/AdminCard";

type Props = {
  leadId: number;
};

type FollowUpType =
  | "CALL"
  | "MEETING"
  | "DEMO"
  | "PROPOSAL"
  | "CUSTOM";

const followUpTypes: {
  value: FollowUpType;
  label: string;
  defaultTitle: string;
  icon: typeof Phone;
}[] = [
  {
    value: "CALL",
    label: "Call",
    defaultTitle: "Call client",
    icon: Phone,
  },
  {
    value: "MEETING",
    label: "Meeting",
    defaultTitle: "Project meeting",
    icon: Users,
  },
  {
    value: "DEMO",
    label: "Demo",
    defaultTitle: "Product demo",
    icon: MonitorPlay,
  },
  {
    value: "PROPOSAL",
    label: "Proposal",
    defaultTitle: "Proposal follow-up",
    icon: Presentation,
  },
  {
    value: "CUSTOM",
    label: "Custom",
    defaultTitle: "",
    icon: FileText,
  },
];

export default function ScheduleFollowUpForm({
  leadId,
}: Props) {
  const router = useRouter();

  const [followUpType, setFollowUpType] =
    useState<FollowUpType>("CALL");

  const [title, setTitle] = useState("Call client");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | null>(
    null,
  );

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  function selectFollowUpType(type: FollowUpType) {
    const selectedType = followUpTypes.find(
      (item) => item.value === type,
    );

    setFollowUpType(type);
    setTitle(selectedType?.defaultTitle ?? "");
    setSuccessMessage("");
    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setSuccessMessage("");
    setError("");

    try {
      if (!title.trim()) {
        throw new Error("Please enter a follow-up title.");
      }

      if (!scheduledAt) {
        throw new Error("Please select a date and time.");
      }

      if (scheduledAt <= new Date()) {
        throw new Error("Please select a future date and time.");
      }

      const response = await fetch(
        `/api/admin/leads/${leadId}/follow-ups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            scheduledAt: scheduledAt.toISOString(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to schedule follow-up.",
        );
      }

      setFollowUpType("CALL");
      setTitle("Call client");
      setDescription("");
      setScheduledAt(null);
      setSuccessMessage("Follow-up scheduled successfully.");

      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminCard className="p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ece8ff] text-[#4648d4]">
          <CalendarPlus className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#1b1b23]">
            Schedule follow-up
          </h2>

          <p className="mt-1 text-sm text-[#6b7280]">
            Set the next call, meeting, demo or reminder.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Quick follow-up types */}
        <div>
          <p className="mb-2 text-sm font-semibold text-[#262631]">
            Follow-up type
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {followUpTypes.map((item) => {
              const Icon = item.icon;
              const active = followUpType === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    selectFollowUpType(item.value)
                  }
                  className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                    active
                      ? "border-[#6466e8] bg-[#ece8ff] text-[#4648d4] ring-2 ring-[#6466e8]/10"
                      : "border-[#ddd9e8] bg-white text-[#666473] hover:border-[#aaa7dc] hover:bg-[#faf9ff]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="followUpTitle"
            className="mb-2 block text-sm font-semibold text-[#262631]"
          >
            Follow-up title
          </label>

          <input
            id="followUpTitle"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={150}
            placeholder="Call regarding proposal"
            className="h-12 w-full rounded-xl border border-[#d8d5e4] bg-[#fbfaff] px-4 text-sm outline-none transition focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
          />
        </div>

        {/* Professional date/time picker */}
        <div>
          <label
            htmlFor="scheduledAt"
            className="mb-2 block text-sm font-semibold text-[#262631]"
          >
            Date and time
          </label>

          <div className="relative">
            <CalendarPlus className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#777584]" />

            <DatePicker
              id="scheduledAt"
              selected={scheduledAt}
              onChange={(date: Date | null) =>
                setScheduledAt(date)
              }
              showTimeSelect
              timeIntervals={15}
              minDate={new Date()}
              dateFormat="dd MMM yyyy, h:mm aa"
              placeholderText="Select follow-up date and time"
              wrapperClassName="w-full"
              className="h-12 w-full cursor-pointer rounded-xl border border-[#d8d5e4] bg-white pl-12 pr-12 text-sm text-[#353541] outline-none transition placeholder:text-[#aaa8b7] focus:border-[#6466e8] focus:ring-4 focus:ring-[#6466e8]/10"
              calendarClassName="crm-datepicker"
              popperPlacement="bottom-start"
              showPopperArrow={false}
            />

            <Clock3 className="pointer-events-none absolute right-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#777584]" />
          </div>

          <p className="mt-2 text-xs text-[#8b8998]">
            Time slots are available in 15-minute intervals.
          </p>
        </div>

        {/* Notes */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="followUpDescription"
              className="text-sm font-semibold text-[#262631]"
            >
              Notes
            </label>

            <span className="text-xs text-[#8b8998]">
              {description.length}/2000
            </span>
          </div>

          <textarea
            id="followUpDescription"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            maxLength={2000}
            placeholder="Discuss pricing, requirements, proposal feedback or next steps..."
            className="min-h-[130px] w-full resize-y rounded-xl border border-[#d8d5e4] bg-[#fbfaff] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
          />
        </div>

        {successMessage && (
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {successMessage}
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
          <CalendarPlus className="h-4 w-4" />

          {saving
            ? "Scheduling..."
            : "Schedule follow-up"}
        </AdminButton>
      </form>
    </AdminCard>
  );
}