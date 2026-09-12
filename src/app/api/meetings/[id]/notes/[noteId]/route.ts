import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type Params = { params: Promise<{ id: string; noteId: string }> };

const updateSchema = z.object({
  content: z.string().trim().min(1).optional(),
});

export async function PATCH(request: NextRequest, { params }: Params) {
  const { noteId } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const existing = await prisma.meetingNote.findUnique({ where: { id: noteId } });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const note = await prisma.meetingNote.update({
    where: { id: noteId },
    data: parsed.data,
  });
  return NextResponse.json({ item: note });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { noteId } = await params;
  const existing = await prisma.meetingNote.findUnique({ where: { id: noteId } });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  await prisma.meetingNote.delete({ where: { id: noteId } });
  return NextResponse.json({ ok: true });
}
