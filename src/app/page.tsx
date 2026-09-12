"use client";

import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import QuickAddInformation from "@/components/QuickAddInformation";
import type { InformationDTO, MeetingDTO } from "@/lib/types";

interface StatsResponse {
  counts: {
    unsorted: number;
    needsConfirm: number;
    deepDive: number;
    incompleteActions: number;
  };
  recent: InformationDTO[];
  meetings: MeetingDTO[];
}

export default function HomePage() {
  const { data, mutate } = useSWR<StatsResponse>("/api/stats", fetcher);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <QuickAddInformation autoFocus onAdded={() => mutate()} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          href="/information?unsorted=true"
          label="未整理"
          value={data?.counts.unsorted}
        />
        <StatCard
          href="/information?action=共有・確認"
          label="要確認"
          value={data?.counts.needsConfirm}
        />
        <StatCard
          href="/information?action=深掘り"
          label="深掘り"
          value={data?.counts.deepDive}
        />
        <StatCard
          href="/actions"
          label="未完了Action"
          value={data?.counts.incompleteActions}
        />
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            最近追加した情報
          </h2>
          <Link href="/information" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
            すべて見る
          </Link>
        </div>
        <ul className="divide-y divide-black/5 rounded-xl border border-black/10 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-white/5">
          {data?.recent.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-gray-400">
              まだ情報がありません
            </li>
          )}
          {data?.recent.map((item) => (
            <li key={item.id} className="px-4 py-3 text-sm">
              <p className="truncate font-medium">{item.content}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {[item.project, item.system, item.domain].filter(Boolean).join(" / ") || "対象未設定"}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">会議</h2>
          <Link href="/meetings" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
            すべて見る
          </Link>
        </div>
        <ul className="divide-y divide-black/5 rounded-xl border border-black/10 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-white/5">
          {data?.meetings.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-gray-400">
              まだ会議がありません
            </li>
          )}
          {data?.meetings.map((meeting) => (
            <li key={meeting.id}>
              <Link
                href={`/meetings/${meeting.id}`}
                className="block px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10"
              >
                {meeting.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  href,
  label,
  value,
}: {
  href: string;
  label: string;
  value?: number;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-black/10 bg-white p-3 text-center shadow-sm transition hover:border-blue-400 dark:border-white/10 dark:bg-white/5"
    >
      <p className="text-2xl font-bold">{value ?? "–"}</p>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </Link>
  );
}
