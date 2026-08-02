import { NextResponse } from "next/server";
import { LeadStatus } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

const allowedStatuses = new Set<LeadStatus>([
  "NEW",
  "CONTACTED",
  "MEETING_SCHEDULED",
  "PROPOSAL_SENT",
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

    const existingLead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      select: {
        id: true,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead not found.",
        },
        { status: 404 },
      );
    }

    const lead = await prisma.lead.update({
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

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully.",
      lead,
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