"use client";

import { useState, FormEvent } from "react";
import { apiPost, apiPatch, apiDelete } from "@/lib/fetcher";
import type { MeetingNoteDTO } from "@/lib/types";
import type { MeetingNoteType } from "@/lib/constants";

const SECTION_STYLES: Record<MeetingNoteType, string> = {
  topic: "border-blue-200 dark:border-blue-900",
  fact: "border-gray-200 dark:border-gray-700",
  open_issue: "border-amber-200 dark:border-amber-900",
  decision: "border-emerald-200 dark:border-emerald-900",
};

export default function MeetingNoteSection({
  meetingId,
  type,
  label,
  notes,
  onChanged,
}: {
  meetingId: string;
  type: MeetingNoteType;
  label: string;
  notes: MeetingNoteDTO[];
  onChanged: () => void;
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await apiPost(`/api/meetings/${meetingId}/notes`, { type, content: text });
      setText("");
      onChanged();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(noteId: string) {
    if (!editText.trim()) return;
    await apiPatch(`/api/meetings/${meetingId}/notes/${noteId}`, { content: editText });
    setEditingId(null);
    onChanged();
  }

  async function handleDelete(noteId: string) {
    await apiDelete(`/api/meetings/${meetingId}/notes/${noteId}`);
    onChanged();
  }

  return (
    <section className={`rounded-xl border-2 bg-white p-4 dark:bg-white/5 ${SECTION_STYLES[type]}`}>
      <h3 className="mb-2 text-sm font-semibold">■ {label}</h3>
      <ul className="mb-2 space-y-1.5">
        {notes.length === 0 && <li className="text-xs text-gray-400">まだありません</li>}
        {notes.map((note) => (
          <li key={note.id} className="group flex items-start gap-2 text-sm">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
            {editingId === note.id ? (
              <input
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => handleUpdate(note.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdate(note.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="flex-1 rounded border border-black/15 px-1.5 py-0.5 text-sm dark:border-white/20 dark:bg-transparent"
              />
            ) : (
              <button
                className="flex-1 text-left"
                onClick={() => {
                  setEditingId(note.id);
                  setEditText(note.content);
                }}
              >
                {note.content}
              </button>
            )}
            <button
              onClick={() => handleDelete(note.id)}
              className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500"
              aria-label="削除"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="flex gap-1.5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`＋ ${label}を追加`}
          className="flex-1 rounded-lg border border-black/15 px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
        />
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 dark:bg-gray-200 dark:text-gray-900"
        >
          追加
        </button>
      </form>
    </section>
  );
}
