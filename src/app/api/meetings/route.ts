import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { meetingCreateSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const project = searchParams.get("project");

  const meetings = await prisma.meeting.findMany({
    where: project ? { project } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { informations: true, nextActions: true, notes: true } },
    },
  });

  return NextResponse.json({ items: meetings });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = meetingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const meeting = await prisma.meeting.create({
    data: {
      title: data.title,
      project: data.project,
      meetingDate: data.meetingDate ? new Date(data.meetingDate) : undefined,
    },
  });
  return NextResponse.json({ item: meeting }, { status: 201 });
}
