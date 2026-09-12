import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function distinctNonNull(values: (string | null)[]) {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort();
}

export async function GET() {
  const items = await prisma.information.findMany({
    where: { archived: false },
    select: { project: true, system: true, domain: true, source: true },
  });

  return NextResponse.json({
    projects: distinctNonNull(items.map((i) => i.project)),
    systems: distinctNonNull(items.map((i) => i.system)),
    domains: distinctNonNull(items.map((i) => i.domain)),
    sources: distinctNonNull(items.map((i) => i.source)),
  });
}
