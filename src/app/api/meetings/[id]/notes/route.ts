import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { meetingNoteCreateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id: meetingId } = await params;
  const body = await request.json();
  const parsed = meetingNoteCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) {
    return NextResponse.json({ error: "meeting not found" }, { status: 404 });
  }

  const { type, content } = parsed.data;
  const maxOrder = await prisma.meetingNote.aggregate({
    where: { meetingId, type },
    _max: { order: true },
  });

  const note = await prisma.meetingNote.create({
    data: {
      meetingId,
      type,
      content,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json({ item: note }, { status: 201 });
}
