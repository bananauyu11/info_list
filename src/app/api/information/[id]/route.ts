import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { informationUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const item = await prisma.information.findUnique({
    where: { id },
    include: {
      meeting: { select: { id: true, title: true } },
      nextActions: true,
    },
  });
  if (!item) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = informationUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.information.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const data = parsed.data;
  const item = await prisma.information.update({
    where: { id },
    data: {
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.project !== undefined ? { project: data.project } : {}),
      ...(data.system !== undefined ? { system: data.system } : {}),
      ...(data.domain !== undefined ? { domain: data.domain } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.importance !== undefined
        ? { importance: data.importance }
        : {}),
      ...(data.understandingLevel !== undefined
        ? { understandingLevel: data.understandingLevel }
        : {}),
      ...(data.action !== undefined ? { action: data.action } : {}),
      ...(data.source !== undefined ? { source: data.source } : {}),
      ...(data.sourceDetail !== undefined
        ? { sourceDetail: data.sourceDetail }
        : {}),
      ...(data.note !== undefined ? { note: data.note } : {}),
      ...(data.meetingId !== undefined ? { meetingId: data.meetingId } : {}),
      ...(data.archived !== undefined ? { archived: data.archived } : {}),
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await prisma.information.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  await prisma.information.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
