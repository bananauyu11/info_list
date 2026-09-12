"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher, apiPatch } from "@/lib/fetcher";
import {
  ACTION_OPTIONS,
  CATEGORY_OPTIONS,
  IMPORTANCE_OPTIONS,
  UNDERSTANDING_LEVEL_OPTIONS,
} from "@/lib/constants";
import type { InformationDTO } from "@/lib/types";

const selectCls =
  "w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent";

export default function TriagePage() {
  const { data, mutate } = useSWR<{ items: InformationDTO[] }>(
    "/api/information?unsorted=true&archived=false",
    fetcher
  );
  const [index, setIndex] = useState(0);

  const items = data?.items ?? [];
  const safeIndex = Math.min(index, Math.max(items.length - 1, 0));
  const current = items[safeIndex];

  async function handleResolved() {
    // アイテムが未整理リストから外れるため、同じ位置に次のアイテムが繰り上がる
    await mutate();
  }

  function handleSkip() {
    setIndex((i) => (i + 1 >= items.length ? 0 : i + 1));
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">未整理 {items.length}件</h1>
        <Link href="/information" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          一覧に戻る
        </Link>
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/15 py-16 text-center text-sm text-gray-400 dark:border-white/15">
          未整理の情報はありません 🎉
        </div>
      )}

      {current && (
        <TriageCard
          key={current.id}
          item={current}
          total={items.length}
          onResolved={handleResolved}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
}

function TriageCard({
  item,
  total,
  onResolved,
  onSkip,
}: {
  item: InformationDTO;
  total: number;
  onResolved: () => void;
  onSkip: () => void;
}) {
  const [category, setCategory] = useState(item.category);
  const [importance, setImportance] = useState(item.importance);
  const [understandingLevel, setUnderstandingLevel] = useState(item.understandingLevel);
  const [action, setAction] = useState(item.action);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await apiPatch(`/api/information/${item.id}`, {
        category,
        importance,
        understandingLevel,
        action,
      });
      onResolved();
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    setSaving(true);
    try {
      await apiPatch(`/api/information/${item.id}`, { archived: true });
      onResolved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <p className="mb-1 text-xs text-gray-400">残り {total}件</p>
      <p className="mb-4 text-base font-semibold">{item.content}</p>
      {(item.project || item.system || item.domain) && (
        <p className="mb-4 text-xs text-gray-400">
          {[item.project, item.system, item.domain].filter(Boolean).join(" / ")}
        </p>
      )}
      {item.note && (
        <p className="mb-4 rounded-lg bg-gray-50 p-2 text-xs text-gray-500 dark:bg-white/5 dark:text-gray-400">
          {item.note}
        </p>
      )}

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            カテゴリー
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">重要度</label>
          <select value={importance} onChange={(e) => setImportance(e.target.value)} className={selectCls}>
            {IMPORTANCE_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">理解深度</label>
          <select
            value={understandingLevel}
            onChange={(e) => setUnderstandingLevel(e.target.value)}
            className={selectCls}
          >
            {UNDERSTANDING_LEVEL_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">今やること</label>
          <select value={action} onChange={(e) => setAction(e.target.value)} className={selectCls}>
            {ACTION_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          保存して次へ
        </button>
        <button
          onClick={onSkip}
          className="rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20"
        >
          後で
        </button>
        <button
          onClick={handleArchive}
          className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          不要
        </button>
      </div>
    </div>
  );
}
