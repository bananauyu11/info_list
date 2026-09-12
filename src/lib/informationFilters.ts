import { Prisma } from "@/generated/prisma/client";

export function buildInformationWhere(
  searchParams: URLSearchParams
): Prisma.InformationWhereInput {
  const where: Prisma.InformationWhereInput = {};

  const archived = searchParams.get("archived");
  where.archived = archived === "true";

  const stringFilters = [
    "project",
    "system",
    "domain",
    "category",
    "importance",
    "understandingLevel",
    "action",
    "source",
    "meetingId",
  ] as const;
  for (const key of stringFilters) {
    const value = searchParams.get(key);
    if (value) (where as Record<string, unknown>)[key] = value;
  }

  const q = searchParams.get("q");
  if (q) {
    where.OR = [
      { content: { contains: q } },
      { note: { contains: q } },
      { project: { contains: q } },
      { system: { contains: q } },
      { domain: { contains: q } },
    ];
  }

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(`${to}T23:59:59`) } : {}),
    };
  }

  return where;
}
