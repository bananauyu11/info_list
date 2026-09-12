"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher, apiPatch, apiPost, apiDelete } from "@/lib/fetcher";
import { NEXT_ACTION_STATUS_COLORS, NEXT_ACTION_STATUS_OPTIONS } from "@/lib/constants";
import type { NextActionDTO } from "@/lib/types";

export default function ActionsPage() {
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const { data, mutate } = useSWR<{ items: NextActionDTO[] }>(
    `/api/next-actions${query}`,
    fetcher
  );

  async function handleStatusChange(id: string, newStatus: string) {
    await apiPatch(`/api/next-actions/${id}`, { status: newStatus });
    mutate();
  }

  async function handleDelete(id: string) {
    if (!confirm("このNext Actionを削除しますか？")) return;
    await apiDelete(`/api/next-actions/${id}`);
    mutate();
  }

  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Next Action</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white"
        >
          ＋ 追加
        </button>
      </div>

      {showForm && (
        <CreateForm
          onCreated={() => {
            setShowForm(false);
            mutate();
          }}
        />
      )}

      <div className="flex flex-wrap gap-2">
        <StatusFilterButton label="すべて" active={status === ""} onClick={() => setStatus("")} />
        {NEXT_ACTION_STATUS_OPTIONS.map((s) => (
          <StatusFilterButton key={s} label={s} active={status === s} onClick={() => setStatus(s)} />
        ))}
      </div>

      <ul className="space-y-2">
        {items.length === 0 && (
          <li className="rounded-xl border border-dashed border-black/15 py-16 text-center text-sm text-gray-400 dark:border-white/15">
            該当するNext Actionはありません
          </li>
        )}
        {items.map((na) => (
          <li
            key={na.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium">{na.action}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {na.owner ? `${na.owner} ・ ` : ""}
                {na.dueDate ? `〆${na.dueDate.slice(0, 10)} ・ ` : ""}
                {na.meeting && (
                  <Link href={`/meetings/${na.meeting.id}`} className="text-blue-500 hover:underline">
                    📅 {na.meeting.title}
                  </Link>
                )}
                {na.information && (
                  <span className="ml-1 text-gray-400">元情報：{na.information.content.slice(0, 24)}</span>
                )}
              </p>
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
            <button
              onClick={() => handleDelete(na.id)}
              className="text-gray-300 hover:text-red-500"
              aria-label="削除"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusFilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
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

function CreateForm({ onCreated }: { onCreated: () => void }) {
  const [action, setAction] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!action.trim() || submitting) return;
    setSubmitting(true);
    try {
      await apiPost("/api/next-actions", { action, owner: owner || undefined, dueDate: dueDate || undefined });
      setAction("");
      setOwner("");
      setDueDate("");
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-2 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5"
    >
      <input
        autoFocus
        value={action}
        onChange={(e) => setAction(e.target.value)}
        placeholder="何をする？"
        className="min-w-[200px] flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
      />
      <input
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        placeholder="担当者"
        className="w-28 rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
      />
      <button
        type="submit"
        disabled={!action.trim() || submitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        追加
      </button>
    </form>
  );
}
