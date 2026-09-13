"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { IMPORT_COLUMNS } from "@/lib/csv";

interface PreviewRow {
  rowNumber: number;
  raw: Record<string, string>;
  errors: string[];
  data: Record<string, unknown> | null;
}

interface ImportResponse {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  createdCount?: number;
  rows: PreviewRow[];
}

export default function ImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportResponse | null>(null);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setError(null);
    const text = await file.text();
    setCsvText(text);
    await runPreview(text);
  }

  async function runPreview(text: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/information/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText: text, commit: false }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "解析に失敗しました");
      }
      const data = await res.json();
      setPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "解析に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleCommit() {
    if (!csvText) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/information/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText, commit: true }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "登録に失敗しました");
      }
      const data = await res.json();
      setResult(data);
      setPreview(null);
      setCsvText(null);
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">CSVインポート</h1>
        <Link href="/information" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          一覧に戻る
        </Link>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4 text-xs text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
        <p className="mb-1 font-medium text-gray-700 dark:text-gray-200">対応カラム</p>
        <p className="font-mono break-all">{IMPORT_COLUMNS.join(", ")}</p>
        <p className="mt-2">
          content 以外は任意です。id を指定した場合は既存データと重複していないか確認します。
          文字コードは UTF-8（BOM付き推奨）に対応しています。
        </p>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="text-sm"
        />
        {fileName && <p className="mt-2 text-xs text-gray-400">選択中のファイル: {fileName}</p>}
      </div>

      {loading && <p className="text-sm text-gray-400">処理中…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {preview && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4 rounded-xl border border-black/10 bg-white p-4 text-sm dark:border-white/10 dark:bg-white/5">
            <p>全 {preview.totalRows} 行</p>
            <p className="text-emerald-600">正常 {preview.validCount} 行</p>
            <p className="text-red-600">エラー {preview.invalidCount} 行</p>
          </div>

          {preview.invalidCount > 0 && (
            <div className="overflow-x-auto rounded-xl border border-red-200 dark:border-red-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-red-50 dark:bg-red-950/40">
                  <tr>
                    <th className="px-3 py-2">行</th>
                    <th className="px-3 py-2">内容</th>
                    <th className="px-3 py-2">エラー</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100 dark:divide-red-900/50">
                  {preview.rows
                    .filter((r) => r.errors.length > 0)
                    .map((r) => (
                      <tr key={r.rowNumber}>
                        <td className="px-3 py-2">{r.rowNumber}</td>
                        <td className="max-w-xs truncate px-3 py-2">{r.raw.content}</td>
                        <td className="px-3 py-2 text-red-600">{r.errors.join(" / ")}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={handleCommit}
            disabled={loading || preview.validCount === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            正常な {preview.validCount} 行を登録する
          </button>
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {result.createdCount ?? 0} 件登録しました。
          {result.invalidCount > 0 && ` （${result.invalidCount}件はエラーのためスキップしました）`}
          <div className="mt-2">
            <Link href="/information" className="underline">
              情報整理一覧を確認する
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
