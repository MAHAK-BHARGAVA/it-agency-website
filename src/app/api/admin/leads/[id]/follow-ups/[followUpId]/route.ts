import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
    followUpId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Context,
) {
  try {
    const { id, followUpId } = await params;

    const leadId = Number(id);
    const followUpIdNumber = Number(followUpId);

    // Validate IDs
    if (
      !Number.isInteger(leadId) ||
      leadId <= 0 ||
      !Number.isInteger(followUpIdNumber) ||
      followUpIdNumber <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid lead or follow-up ID.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const status = String(body.status ?? "");

    // Only these two actions are allowed
    if (
      status !== "COMPLETED" &&
      status !== "CANCELLED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid follow-up status.",
        },
        { status: 400 },
      );
    }

    // Make sure this follow-up actually belongs to this lead
    const existingFollowUp =
      await prisma.leadFollowUp.findFirst({
        where: {
          id: followUpIdNumber,
          leadId,
        },
        select: {
          id: true,
          leadId: true,
          title: true,
          status: true,
        },
      });

    if (!existingFollowUp) {
      return NextResponse.json(
        {
          success: false,
          message: "Follow-up not found for this lead.",
        },
        { status: 404 },
      );
    }

    if (existingFollowUp.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only pending follow-ups can be completed or cancelled.",
        },
        { status: 400 },
      );
    }

    const updatedFollowUp = await prisma.$transaction(
      async (tx) => {
        // Update follow-up
        const followUp = await tx.leadFollowUp.update({
          where: {
            id: followUpIdNumber,
          },
          data: {
            status:
              status === "COMPLETED"
                ? "COMPLETED"
                : "CANCELLED",

            completedAt:
              status === "COMPLETED"
                ? new Date()
                : null,
          },
        });

        // Add activity to lead timeline
        await tx.leadActivity.create({
          data: {
            leadId,
            type: "FOLLOW_UP",
            title:
              status === "COMPLETED"
                ? "Follow-up completed"
                : "Follow-up cancelled",
            description: existingFollowUp.title,
          },
        });

        return followUp;
      },
      {
        // We already saw Railway taking >5 seconds,
        // so don't use Prisma's default 5s timeout.
        maxWait: 10000,
        timeout: 20000,
      },
    );

    return NextResponse.json({
      success: true,
      message:
        status === "COMPLETED"
          ? "Follow-up completed successfully."
          : "Follow-up cancelled successfully.",
      followUp: updatedFollowUp,
    });
  } catch (error) {
    console.error("Follow-up PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update follow-up.",
      },
      { status: 500 },
    );
  }
}