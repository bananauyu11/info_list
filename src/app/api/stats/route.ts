import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnsorted } from "@/lib/constants";

export async function GET() {
  const [active, recent, meetings, incompleteActions] = await Promise.all([
    prisma.information.findMany({
      where: { archived: false },
      select: {
        category: true,
        importance: true,
        understandingLevel: true,
        action: true,
      },
    }),
    prisma.information.findMany({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.meeting.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.nextAction.count({
      where: { status: { in: ["未着手", "対応中"] } },
    }),
  ]);

  const unsortedCount = active.filter(isUnsorted).length;
  const needsConfirmCount = active.filter((i) => i.action === "共有・確認").length;
  const deepDiveCount = active.filter((i) => i.action === "深掘り").length;

  return NextResponse.json({
    counts: {
      unsorted: unsortedCount,
      needsConfirm: needsConfirmCount,
      deepDive: deepDiveCount,
      incompleteActions,
    },
    recent,
    meetings,
  });
}
