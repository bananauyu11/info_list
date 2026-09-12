"use client";

import { useState, FormEvent } from "react";
import { apiPost, apiPatch } from "@/lib/fetcher";
import { NEXT_ACTION_STATUS_COLORS, NEXT_ACTION_STATUS_OPTIONS } from "@/lib/constants";
import type { NextActionDTO } from "@/lib/types";

export default function MeetingNextActionSection({
  meetingId,
  nextActions,
  onChanged,
}: {
  meetingId: string;
  nextActions: NextActionDTO[];
  onChanged: () => void;
}) {
  const [action, setAction] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!action.trim() || submitting) return;
    setSubmitting(true);
    try {
      await apiPost("/api/next-actions", {
        action,
        owner: owner || undefined,
        dueDate: dueDate || undefined,
        meetingId,
      });
      setAction("");
      setOwner("");
      setDueDate("");
      onChanged();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    await apiPatch(`/api/next-actions/${id}`, { status });
    onChanged();
  }

  return (
    <section className="rounded-xl border-2 border-purple-200 bg-white p-4 dark:border-purple-900 dark:bg-white/5">
      <h3 className="mb-2 text-sm font-semibold">■ Next Action</h3>
      <ul className="mb-2 space-y-1.5">
        {nextActions.length === 0 && <li className="text-xs text-gray-400">まだありません</li>}
        {nextActions.map((na) => (
          <li
            key={na.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
          >
            <div>
              <p className="font-medium">
                {na.owner ? `${na.owner}：` : ""}
                {na.action}
              </p>
              {na.dueDate && <p className="text-xs text-gray-400">〆{na.dueDate.slice(0, 10)}</p>}
            </div>
            <select
              value={na.status}
              onChange={(e) => handleStatusChange(na.id, e.target.value)}
              className={`rounded-full border-0 px-2 py-1 text-xs font-medium ${NEXT_ACTION_STATUS_COLORS[na.status]}`}
            >
              {NEXT_ACTION_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="flex flex-wrap gap-1.5">
        <input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="＋ Next Action（例：影響範囲を確認する）"
          className="min-w-[160px] flex-1 rounded-lg border border-black/15 px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
        />
        <input
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="担当者"
          className="w-24 rounded-lg border border-black/15 px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-black/15 px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
        />
        <button
          type="submit"
          disabled={!action.trim() || submitting}
          className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
        >
          追加
        </button>
      </form>
    </section>
  );
}
