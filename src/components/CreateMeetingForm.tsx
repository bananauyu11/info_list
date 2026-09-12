"use client";

import { useState, FormEvent } from "react";
import { apiPost } from "@/lib/fetcher";
import type { MeetingDTO } from "@/lib/types";

export default function CreateMeetingForm({
  onCreated,
}: {
  onCreated: (meeting: MeetingDTO) => void;
}) {
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [meetingDate, setMeetingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { item } = await apiPost<{ item: MeetingDTO }>("/api/meetings", {
        title,
        project: project || undefined,
        meetingDate: meetingDate || undefined,
      });
      onCreated(item);
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
        作成して会議を開始
      </button>
    </form>
  );
}
