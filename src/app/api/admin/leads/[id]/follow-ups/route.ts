import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
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

    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const scheduledAt = new Date(String(body.scheduledAt ?? ""));

    if (title.length < 2 || title.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid follow-up title.",
        },
        { status: 400 },
      );
    }

    if (
      Number.isNaN(scheduledAt.getTime()) ||
      scheduledAt <= new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a future date and time.",
        },
        { status: 400 },
      );
    }

    if (description.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: "Notes cannot exceed 2000 characters.",
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

    const followUp = await prisma.$transaction(async (tx) => {
      const createdFollowUp = await tx.leadFollowUp.create({
        data: {
          leadId,
          title,
          description: description || null,
          scheduledAt,
        },
      });

      await tx.leadActivity.create({
        data: {
          leadId,
          type: "FOLLOW_UP",
          title: "Follow-up scheduled",
          description: `${title} — ${scheduledAt.toLocaleString(
            "en-IN",
            {
              dateStyle: "medium",
              timeStyle: "short",
            },
          )}`,
        },
      });

      return createdFollowUp;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Follow-up scheduled successfully.",
        followUp,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create follow-up error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to schedule follow-up.",
      },
      { status: 500 },
    );
  }
}