import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { informationCreateSchema } from "@/lib/validation";
import { isUnsorted } from "@/lib/constants";
import { buildInformationWhere } from "@/lib/informationFilters";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const where = buildInformationWhere(searchParams);
  const unsorted = searchParams.get("unsorted");

  let items = await prisma.information.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { meeting: { select: { id: true, title: true } } },
  });

  if (unsorted === "true") {
    items = items.filter((item) => isUnsorted(item));
  }

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = informationCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const information = await prisma.information.create({
    data: {
      content: data.content,
      project: data.project,
      system: data.system,
      domain: data.domain,
      category: data.category,
      importance: data.importance,
      understandingLevel: data.understandingLevel,
      action: data.action,
      source: data.source,
      sourceDetail: data.sourceDetail,
      note: data.note,
      meetingId: data.meetingId,
    },
  });

  return NextResponse.json({ item: information }, { status: 201 });
}
