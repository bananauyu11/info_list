"use client";

import { ACTION_COLORS, IMPORTANCE_COLORS } from "@/lib/constants";
import { Badge } from "@/components/Badge";
import type { InformationDTO } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function InformationList({
  items,
  onSelect,
}: {
  items: InformationDTO[];
  onSelect: (item: InformationDTO) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/15 py-16 text-center text-sm text-gray-400 dark:border-white/15">
        該当する情報がありません
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-black/10 bg-white md:block dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2 font-medium">内容</th>
              <th className="px-4 py-2 font-medium">対象</th>
              <th className="px-4 py-2 font-medium">カテゴリー</th>
              <th className="px-4 py-2 font-medium">重要度</th>
              <th className="px-4 py-2 font-medium">理解度</th>
              <th className="px-4 py-2 font-medium">Action</th>
              <th className="px-4 py-2 font-medium">登録日時</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/10">
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelect(item)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10"
              >
                <td className="max-w-xs px-4 py-2.5">
                  <p className="truncate font-medium">{item.content}</p>
                  {item.meeting && (
                    <p className="truncate text-xs text-blue-500">📅 {item.meeting.title}</p>
                  )}
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400">
                  {[item.project, item.system, item.domain].filter(Boolean).join(" / ") || "—"}
                </td>
                <td className="px-4 py-2.5 text-xs">{item.category}</td>
                <td className="px-4 py-2.5">
                  <Badge label={item.importance} colorClass={IMPORTANCE_COLORS[item.importance]} />
                </td>
                <td className="px-4 py-2.5 text-xs">{item.understandingLevel}</td>
                <td className="px-4 py-2.5">
                  <Badge label={item.action} colorClass={ACTION_COLORS[item.action]} />
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-400">
                  {formatDate(item.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-2 md:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSelect(item)}
              className="w-full rounded-xl border border-black/10 bg-white p-3 text-left shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <p className="font-medium">{item.content}</p>
              <p className="mt-1 text-xs text-gray-400">
                {[item.project, item.system, item.domain].filter(Boolean).join(" / ") || "対象未設定"}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge label={item.category} />
                <Badge label={item.importance} colorClass={IMPORTANCE_COLORS[item.importance]} />
                <Badge label={item.understandingLevel} />
                <Badge label={item.action} colorClass={ACTION_COLORS[item.action]} />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
