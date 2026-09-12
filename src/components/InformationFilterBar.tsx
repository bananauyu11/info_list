"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
  ACTION_OPTIONS,
  CATEGORY_OPTIONS,
  IMPORTANCE_OPTIONS,
  SOURCE_OPTIONS,
  UNDERSTANDING_LEVEL_OPTIONS,
} from "@/lib/constants";

export interface InformationFilters {
  q: string;
  project: string;
  system: string;
  domain: string;
  category: string;
  importance: string;
  understandingLevel: string;
  action: string;
  source: string;
  unsorted: boolean;
  archived: boolean;
}

export const EMPTY_FILTERS: InformationFilters = {
  q: "",
  project: "",
  system: "",
  domain: "",
  category: "",
  importance: "",
  understandingLevel: "",
  action: "",
  source: "",
  unsorted: false,
  archived: false,
};

interface MetaResponse {
  projects: string[];
  systems: string[];
  domains: string[];
  sources: string[];
}

const selectCls =
  "rounded-lg border border-black/15 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent";

export default function InformationFilterBar({
  filters,
  onChange,
}: {
  filters: InformationFilters;
  onChange: (f: InformationFilters) => void;
}) {
  const { data: meta } = useSWR<MetaResponse>("/api/meta", fetcher);

  function set<K extends keyof InformationFilters>(key: K, value: InformationFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  const hasActiveFilter =
    filters.q ||
    filters.project ||
    filters.system ||
    filters.domain ||
    filters.category ||
    filters.importance ||
    filters.understandingLevel ||
    filters.action ||
    filters.source ||
    filters.unsorted ||
    filters.archived;

  return (
    <div className="space-y-2 rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="検索（内容・メモ・対象）"
          className="min-w-[160px] flex-1 rounded-lg border border-black/15 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
        />
        <QuickToggle
          active={filters.unsorted}
          onClick={() => set("unsorted", !filters.unsorted)}
          label="未整理"
        />
        <QuickToggle
          active={filters.importance === "未判定"}
          onClick={() => set("importance", filters.importance === "未判定" ? "" : "未判定")}
          label="重要度未判定"
        />
        <QuickToggle
          active={filters.understandingLevel === "Lv.1"}
          onClick={() =>
            set("understandingLevel", filters.understandingLevel === "Lv.1" ? "" : "Lv.1")
          }
          label="理解度Lv.1"
        />
        <QuickToggle
          active={filters.action === "深掘り"}
          onClick={() => set("action", filters.action === "深掘り" ? "" : "深掘り")}
          label="深掘り"
        />
        <QuickToggle
          active={filters.archived}
          onClick={() => set("archived", !filters.archived)}
          label="アーカイブ済み"
        />
        {hasActiveFilter ? (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="text-xs text-gray-500 underline hover:text-gray-700 dark:text-gray-400"
          >
            条件をクリア
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <select className={selectCls} value={filters.project} onChange={(e) => set("project", e.target.value)}>
          <option value="">プロジェクト（すべて）</option>
          {meta?.projects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select className={selectCls} value={filters.system} onChange={(e) => set("system", e.target.value)}>
          <option value="">システム（すべて）</option>
          {meta?.systems.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select className={selectCls} value={filters.domain} onChange={(e) => set("domain", e.target.value)}>
          <option value="">領域（すべて）</option>
          {meta?.domains.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select className={selectCls} value={filters.category} onChange={(e) => set("category", e.target.value)}>
          <option value="">カテゴリー（すべて）</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className={selectCls} value={filters.importance} onChange={(e) => set("importance", e.target.value)}>
          <option value="">重要度（すべて）</option>
          {IMPORTANCE_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className={selectCls}
          value={filters.understandingLevel}
          onChange={(e) => set("understandingLevel", e.target.value)}
        >
          <option value="">理解深度（すべて）</option>
          {UNDERSTANDING_LEVEL_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className={selectCls} value={filters.action} onChange={(e) => set("action", e.target.value)}>
          <option value="">Action（すべて）</option>
          {ACTION_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className={selectCls} value={filters.source} onChange={(e) => set("source", e.target.value)}>
          <option value="">情報源（すべて）</option>
          {SOURCE_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function QuickToggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-black/15 text-gray-600 hover:border-blue-400 dark:border-white/20 dark:text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}
