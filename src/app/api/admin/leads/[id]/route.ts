import { NextResponse } from "next/server";
import { LeadStatus } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

const allowedStatuses = new Set<LeadStatus>([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "MEETING_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
  "SPAM",
]);

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Context,
) {
  try {
    const { id } = await params;
    const leadId = Number(id);

    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid lead ID.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const status = String(body.status ?? "") as LeadStatus;
    const notes = String(body.notes ?? "").trim();

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid lead status.",
        },
        { status: 400 },
      );
    }

    if (notes.length > 3000) {
      return NextResponse.json(
        {
          success: false,
          message: "Notes cannot exceed 3000 characters.",
        },
        { status: 400 },
      );
    }

    const currentLead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      select: {
        id: true,
        status: true,
        notes: true,
      },
    });

    if (!currentLead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead not found.",
        },
        { status: 404 },
      );
    }

    const oldNotes = currentLead.notes?.trim() ?? "";

    const statusChanged = currentLead.status !== status;
    const notesChanged = oldNotes !== notes;

    const updatedLead = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.update({
        where: {
          id: leadId,
        },
        data: {
          status,
          notes: notes || null,
        },
        select: {
          id: true,
          status: true,
          notes: true,
          updatedAt: true,
        },
      });

      if (statusChanged) {
        await tx.leadActivity.create({
          data: {
            leadId,
            type: "STATUS_CHANGED",
            title: "Lead status changed",
            description: `${formatStatus(
              currentLead.status,
            )} → ${formatStatus(status)}`,
            oldStatus: currentLead.status,
            newStatus: status,
          },
        });
      }

      if (notesChanged) {
        await tx.leadActivity.create({
          data: {
            leadId,
            type: oldNotes ? "NOTE_UPDATED" : "NOTE_ADDED",
            title: oldNotes
              ? "Internal notes updated"
              : "Internal notes added",
            description:
              notes || "Internal notes were cleared.",
          },
        });
      }

      return lead;
    });

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully.",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Lead update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update the lead.",
      },
      { status: 500 },
    );
  }
}

function formatStatus(status: LeadStatus): string {
  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}