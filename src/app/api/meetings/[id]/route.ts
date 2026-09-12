import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { meetingCreateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: {
      notes: { orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "asc" }] },
      informations: { orderBy: { createdAt: "desc" } },
      nextActions: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!meeting) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ item: meeting });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = meetingCreateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const existing = await prisma.meeting.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const data = parsed.data;
  const meeting = await prisma.meeting.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.project !== undefined ? { project: data.project } : {}),
      ...(data.meetingDate !== undefined
        ? { meetingDate: data.meetingDate ? new Date(data.meetingDate) : null }
        : {}),
    },
  });
  return NextResponse.json({ item: meeting });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await prisma.meeting.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  await prisma.meeting.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
