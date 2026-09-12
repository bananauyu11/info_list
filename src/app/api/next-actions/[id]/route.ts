import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextActionUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = nextActionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const existing = await prisma.nextAction.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const data = parsed.data;
  const item = await prisma.nextAction.update({
    where: { id },
    data: {
      ...(data.action !== undefined ? { action: data.action } : {}),
      ...(data.owner !== undefined ? { owner: data.owner } : {}),
      ...(data.dueDate !== undefined
        ? { dueDate: data.dueDate ? new Date(data.dueDate) : null }
        : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.meetingId !== undefined ? { meetingId: data.meetingId } : {}),
      ...(data.informationId !== undefined
        ? { informationId: data.informationId }
        : {}),
    },
  });
  return NextResponse.json({ item });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await prisma.nextAction.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  await prisma.nextAction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
