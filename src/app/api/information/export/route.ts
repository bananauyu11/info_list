import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildInformationWhere } from "@/lib/informationFilters";
import { EXPORT_COLUMNS, formatDateForExport, toCsv } from "@/lib/csv";
import { isUnsorted } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  const where = all ? {} : buildInformationWhere(searchParams);
  let items = await prisma.information.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  if (!all && searchParams.get("unsorted") === "true") {
    items = items.filter(isUnsorted);
  }

  const rows = items.map((item) => ({
    id: item.id,
    content: item.content,
    project: item.project ?? "",
    system: item.system ?? "",
    domain: item.domain ?? "",
    category: item.category,
    importance: item.importance,
    understanding_level: item.understandingLevel,
    action: item.action,
    source: item.source ?? "",
    source_detail: item.sourceDetail ?? "",
    note: item.note ?? "",
    created_at: formatDateForExport(item.createdAt),
    updated_at: formatDateForExport(item.updatedAt),
  }));

  const csv = toCsv(rows, EXPORT_COLUMNS);
  const filename = `information_${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
