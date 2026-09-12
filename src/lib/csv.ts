import Papa from "papaparse";
import {
  ACTION_OPTIONS,
  CATEGORY_OPTIONS,
  IMPORTANCE_OPTIONS,
  UNDERSTANDING_LEVEL_OPTIONS,
} from "./constants";

export const IMPORT_COLUMNS = [
  "id",
  "content",
  "project",
  "system",
  "domain",
  "category",
  "importance",
  "understanding_level",
  "action",
  "source",
  "source_detail",
  "note",
  "created_at",
] as const;

export const EXPORT_COLUMNS = [
  "id",
  "content",
  "project",
  "system",
  "domain",
  "category",
  "importance",
  "understanding_level",
  "action",
  "source",
  "source_detail",
  "note",
  "created_at",
  "updated_at",
] as const;

export type ImportRow = Record<(typeof IMPORT_COLUMNS)[number], string>;

export type ParsedInformationRow = {
  rowNumber: number; // 1-indexed, header excluded
  raw: Record<string, string>;
  errors: string[];
  data: {
    id?: string;
    content: string;
    project?: string;
    system?: string;
    domain?: string;
    category: string;
    importance: string;
    understandingLevel: string;
    action: string;
    source?: string;
    sourceDetail?: string;
    note?: string;
    createdAt?: Date;
  } | null;
};

// "2026-09-12 10:00" や ISO 形式の日時文字列を Date に変換する
export function parseFlexibleDate(value: string | undefined): Date | undefined {
  if (!value || value.trim() === "") return undefined;
  const trimmed = value.trim();
  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
}

function get(row: Record<string, string>, key: string): string {
  return (row[key] ?? "").trim();
}

export function validateImportRow(
  row: Record<string, string>,
  rowNumber: number,
  existingIds: Set<string>,
  seenIdsInFile: Set<string>
): ParsedInformationRow {
  const errors: string[] = [];

  const content = get(row, "content");
  if (!content) {
    errors.push("content が空です");
  }

  const idRaw = get(row, "id");
  let id: string | undefined;
  if (idRaw) {
    if (existingIds.has(idRaw) || seenIdsInFile.has(idRaw)) {
      errors.push(`id "${idRaw}" が重複しています`);
    } else {
      id = idRaw;
    }
    seenIdsInFile.add(idRaw);
  }

  const category = get(row, "category") || "未分類";
  if (!(CATEGORY_OPTIONS as readonly string[]).includes(category)) {
    errors.push(`category "${category}" は不正な値です`);
  }

  const importance = get(row, "importance") || "未判定";
  if (!(IMPORTANCE_OPTIONS as readonly string[]).includes(importance)) {
    errors.push(`importance "${importance}" は不正な値です`);
  }

  const understandingLevelRaw = get(row, "understanding_level") || "未判定";
  if (
    !(UNDERSTANDING_LEVEL_OPTIONS as readonly string[]).includes(
      understandingLevelRaw
    )
  ) {
    errors.push(`understanding_level "${understandingLevelRaw}" は不正な値です`);
  }

  const actionRaw = get(row, "action") || "未判定";
  if (!(ACTION_OPTIONS as readonly string[]).includes(actionRaw)) {
    errors.push(`action "${actionRaw}" は不正な値です`);
  }

  const createdAtRaw = get(row, "created_at");
  let createdAt: Date | undefined;
  if (createdAtRaw) {
    createdAt = parseFlexibleDate(createdAtRaw);
    if (!createdAt) {
      errors.push(`created_at "${createdAtRaw}" の日付形式が不正です`);
    }
  }

  const data =
    errors.length === 0
      ? {
          id,
          content,
          project: get(row, "project") || undefined,
          system: get(row, "system") || undefined,
          domain: get(row, "domain") || undefined,
          category,
          importance,
          understandingLevel: understandingLevelRaw,
          action: actionRaw,
          source: get(row, "source") || undefined,
          sourceDetail: get(row, "source_detail") || undefined,
          note: get(row, "note") || undefined,
          createdAt,
        }
      : null;

  return { rowNumber, raw: row, errors, data };
}

export function parseCsvFile(text: string) {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return result;
}

const BOM = "﻿";

export function toCsv(rows: Record<string, string>[], columns: readonly string[]) {
  const csv = Papa.unparse(
    { fields: [...columns], data: rows.map((r) => columns.map((c) => r[c] ?? "")) },
    { newline: "\r\n" }
  );
  return BOM + csv;
}

export function formatDateForExport(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
