import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextActionCreateSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const meetingId = searchParams.get("meetingId");
  const informationId = searchParams.get("informationId");

  const items = await prisma.nextAction.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(meetingId ? { meetingId } : {}),
      ...(informationId ? { informationId } : {}),
    },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    include: {
      meeting: { select: { id: true, title: true } },
      information: { select: { id: true, content: true } },
    },
  });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = nextActionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const item = await prisma.nextAction.create({
    data: {
      action: data.action,
      owner: data.owner,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      status: data.status,
      meetingId: data.meetingId,
      informationId: data.informationId,
    },
  });
  return NextResponse.json({ item }, { status: 201 });
}
