"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher, apiPost } from "@/lib/fetcher";
import type { MeetingDTO } from "@/lib/types";

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}

export default function MeetingsPage() {
  const { data, mutate } = useSWR<{ items: MeetingDTO[] }>("/api/meetings", fetcher);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">会議</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white"
        >
          ＋ 会議を作成
        </button>
      </div>

      {showForm && (
        <CreateMeetingForm
          onCreated={() => {
            setShowForm(false);
            mutate();
          }}
        />
      )}

      <ul className="space-y-2">
        {data?.items.length === 0 && (
          <li className="rounded-xl border border-dashed border-black/15 py-16 text-center text-sm text-gray-400 dark:border-white/15">
            まだ会議がありません
          </li>
        )}
        {data?.items.map((m) => (
          <li key={m.id}>
            <Link
              href={`/meetings/${m.id}`}
              className="block rounded-xl border border-black/10 bg-white p-4 shadow-sm hover:border-blue-400 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{m.title}</p>
                {formatDate(m.meetingDate) && (
                  <p className="text-xs text-gray-400">{formatDate(m.meetingDate)}</p>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {m.project ? `${m.project} ・ ` : ""}
                論点/決定 {m._count?.notes ?? 0}件・情報 {m._count?.informations ?? 0}件・Next Action {m._count?.nextActions ?? 0}件
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreateMeetingForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [meetingDate, setMeetingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      await apiPost("/api/meetings", {
        title,
        project: project || undefined,
        meetingDate: meetingDate || undefined,
      });
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="会議名（例：○○定例）"
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
      />
      <div className="flex gap-2">
        <input
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="プロジェクト（任意）"
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
        />
        <input
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          className="rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={!title.trim() || submitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        作成
      </button>
    </form>
  );
}
