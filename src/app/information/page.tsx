"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import InformationFilterBar, {
  EMPTY_FILTERS,
  type InformationFilters,
} from "@/components/InformationFilterBar";
import InformationList from "@/components/InformationList";
import InformationDetailPanel from "@/components/InformationDetailPanel";
import QuickAddInformation from "@/components/QuickAddInformation";
import type { InformationDTO } from "@/lib/types";

function buildQuery(filters: InformationFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.project) params.set("project", filters.project);
  if (filters.system) params.set("system", filters.system);
  if (filters.domain) params.set("domain", filters.domain);
  if (filters.category) params.set("category", filters.category);
  if (filters.importance) params.set("importance", filters.importance);
  if (filters.understandingLevel) params.set("understandingLevel", filters.understandingLevel);
  if (filters.action) params.set("action", filters.action);
  if (filters.source) params.set("source", filters.source);
  if (filters.unsorted) params.set("unsorted", "true");
  params.set("archived", filters.archived ? "true" : "false");
  return params.toString();
}

function InformationPageInner() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<InformationFilters>(() => ({
    ...EMPTY_FILTERS,
    unsorted: searchParams.get("unsorted") === "true",
    action: searchParams.get("action") ?? "",
    category: searchParams.get("category") ?? "",
    importance: searchParams.get("importance") ?? "",
  }));
  const [selected, setSelected] = useState<InformationDTO | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const query = useMemo(() => buildQuery(filters), [filters]);
  const { data, mutate } = useSWR<{ items: InformationDTO[] }>(
    `/api/information?${query}`,
    fetcher
  );

  const items = data?.items ?? [];

  function handleAdded() {
    setShowQuickAdd(false);
    mutate();
  }

  function handleSaved(updated: InformationDTO) {
    mutate();
    setSelected(updated);
  }

  function handleDeleted(id: string) {
    setSelected(null);
    mutate((prev) => prev && { items: prev.items.filter((i) => i.id !== id) }, false);
    mutate();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-bold">情報整理一覧</h1>
        <div className="flex gap-2">
          <Link
            href="/information/triage"
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-white/20 dark:hover:bg-white/10"
          >
            未整理を整理する
          </Link>
          <Link
            href="/information/import"
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-white/20 dark:hover:bg-white/10"
          >
            CSVインポート
          </Link>
          {/* CSVダウンロード用のAPIエンドポイントへの直接リンクのため通常のaタグを使用 */}
          <a
            href={`/api/information/export?${query}`}
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-white/20 dark:hover:bg-white/10"
          >
            CSV出力（現在の条件）
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/information/export?all=true"
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-white/20 dark:hover:bg-white/10"
          >
            CSV出力（全件）
          </a>
          <button
            onClick={() => setShowQuickAdd((v) => !v)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white"
          >
            ＋ 情報を追加
          </button>
        </div>
      </div>

      {showQuickAdd && <QuickAddInformation onAdded={handleAdded} autoFocus />}

      <InformationFilterBar filters={filters} onChange={setFilters} />

      <p className="text-xs text-gray-400">{items.length}件</p>

      <InformationList items={items} onSelect={setSelected} />

      {selected && (
        <InformationDetailPanel
          key={selected.id}
          item={selected}
          onClose={() => setSelected(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

export default function InformationPage() {
  return (
    <Suspense fallback={null}>
      <InformationPageInner />
    </Suspense>
  );
}
