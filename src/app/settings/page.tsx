"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface StatsResponse {
  counts: {
    unsorted: number;
    needsConfirm: number;
    deepDive: number;
    incompleteActions: number;
  };
}

export default function SettingsPage() {
  const { data } = useSWR<StatsResponse>("/api/stats", fetcher);

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6">
      <h1 className="text-lg font-bold">設定</h1>

      <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-2 text-sm font-semibold">データのバックアップ</h2>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          登録されている情報をすべてCSV（UTF-8 BOM付き）で出力します。Excelでもそのまま開けます。
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/information/export?all=true"
          className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          全件をCSV出力
        </a>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-2 text-sm font-semibold">現在の状況</h2>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-gray-50 p-2 dark:bg-white/5">
            <dt className="text-xs text-gray-400">未整理</dt>
            <dd className="text-lg font-semibold">{data?.counts.unsorted ?? "–"}</dd>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 dark:bg-white/5">
            <dt className="text-xs text-gray-400">未完了Next Action</dt>
            <dd className="text-lg font-semibold">{data?.counts.incompleteActions ?? "–"}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4 text-xs text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">このアプリについて</h2>
        <p>
          情報を管理するためのアプリではなく、情報を使って仕事を前に進めるためのアプリです。
          入力は最小限に、整理は後からできるように設計しています。
        </p>
      </section>
    </div>
  );
}
