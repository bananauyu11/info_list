import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCsvFile, validateImportRow } from "@/lib/csv";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const csvText: string | undefined = body?.csvText;
  const commit: boolean = Boolean(body?.commit);

  if (!csvText || typeof csvText !== "string") {
    return NextResponse.json({ error: "csvText is required" }, { status: 400 });
  }

  const parsedCsv = parseCsvFile(csvText);
  if (parsedCsv.errors.length > 0) {
    return NextResponse.json(
      {
        error: "CSVの解析に失敗しました",
        details: parsedCsv.errors,
      },
      { status: 400 }
    );
  }

  const existing = await prisma.information.findMany({ select: { id: true } });
  const existingIds = new Set(existing.map((e) => e.id));
  const seenIdsInFile = new Set<string>();

  const rows = parsedCsv.data.map((row, index) =>
    validateImportRow(row, index + 2, existingIds, seenIdsInFile)
  );

  const validRows = rows.filter((r) => r.errors.length === 0 && r.data);
  const invalidRows = rows.filter((r) => r.errors.length > 0);

  if (!commit) {
    return NextResponse.json({
      totalRows: rows.length,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      rows,
    });
  }

  let createdCount = 0;
  await prisma.$transaction(async (tx) => {
    for (const row of validRows) {
      if (!row.data) continue;
      await tx.information.create({
        data: {
          ...(row.data.id ? { id: row.data.id } : {}),
          content: row.data.content,
          project: row.data.project,
          system: row.data.system,
          domain: row.data.domain,
          category: row.data.category,
          importance: row.data.importance,
          understandingLevel: row.data.understandingLevel,
          action: row.data.action,
          source: row.data.source,
          sourceDetail: row.data.sourceDetail,
          note: row.data.note,
          ...(row.data.createdAt ? { createdAt: row.data.createdAt } : {}),
        },
      });
      createdCount++;
    }
  });

  return NextResponse.json({
    totalRows: rows.length,
    validCount: validRows.length,
    invalidCount: invalidRows.length,
    createdCount,
    rows: invalidRows,
  });
}
