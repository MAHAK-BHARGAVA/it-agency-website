import {
  CalendarClock,
  CircleDot,
  FileText,
  History,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";

import type {
  LeadActivityType,
  LeadStatus,
} from "@/generated/prisma/client";

type Activity = {
  id: number;
  type: LeadActivityType;
  title: string;
  description: string | null;
  oldStatus: LeadStatus | null;
  newStatus: LeadStatus | null;
  createdAt: Date;
  createdBy: {
    name: string | null;
    email: string;
  } | null;
};

type Props = {
  activities: Activity[];
  leadCreatedAt: Date;
};

const activityIcons: Partial<
  Record<LeadActivityType, typeof History>
> = {
  STATUS_CHANGED: RefreshCw,
  NOTE_ADDED: MessageSquareText,
  NOTE_UPDATED: FileText,
  MEETING: CalendarClock,
  FOLLOW_UP: CalendarClock,
};

export default function LeadActivityTimeline({
  activities,
  leadCreatedAt,
}: Props) {
  const timeline = [
    ...activities,
    {
      id: -1,
      type: "LEAD_CREATED" as LeadActivityType,
      title: "Lead created",
      description:
        "This enquiry was added to the CRM from the website.",
      oldStatus: null,
      newStatus: "NEW" as LeadStatus,
      createdAt: leadCreatedAt,
      createdBy: null,
    },
  ].sort(
    (a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <section className="rounded-2xl border border-[#e4e2f0] bg-white p-6 shadow-[0_8px_30px_rgba(36,32,74,0.04)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece8ff] text-[#4648d4]">
          <History className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#1b1b23]">
            Activity timeline
          </h2>

          <p className="mt-1 text-sm text-[#6b7280]">
            Complete history of this lead.
          </p>
        </div>
      </div>

      <div className="relative mt-7 space-y-7 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-px before:bg-[#e6e3ef]">
        {timeline.map((activity) => {
          const Icon =
            activityIcons[activity.type] ?? CircleDot;

          return (
            <article
              key={activity.id}
              className="relative flex gap-4"
            >
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ddd9ed] bg-white text-[#6466e8]">
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-semibold text-[#1b1b23]">
                    {activity.title}
                  </h3>

                  <time className="text-xs text-[#9693a3]">
                    {activity.createdAt.toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </time>
                </div>

                {activity.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#666473]">
                    {activity.description}
                  </p>
                )}

                {activity.createdBy && (
                  <p className="mt-2 text-xs text-[#9693a3]">
                    Updated by{" "}
                    {activity.createdBy.name ??
                      activity.createdBy.email}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}