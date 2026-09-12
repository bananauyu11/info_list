"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher, apiPatch, apiDelete, apiPost } from "@/lib/fetcher";
import {
  ACTION_OPTIONS,
  CATEGORY_OPTIONS,
  IMPORTANCE_OPTIONS,
  NEXT_ACTION_STATUS_COLORS,
  SOURCE_OPTIONS,
  UNDERSTANDING_LEVEL_OPTIONS,
} from "@/lib/constants";
import { Badge } from "@/components/Badge";
import type { InformationDTO, NextActionDTO } from "@/lib/types";

const inputCls =
  "w-full rounded-lg border border-black/15 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent";

export default function InformationDetailPanel({
  item,
  onClose,
  onSaved,
  onDeleted,
}: {
  item: InformationDTO;
  onClose: () => void;
  onSaved: (item: InformationDTO) => void;
  onDeleted: (id: string) => void;
}) {
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNextActionForm, setShowNextActionForm] = useState(false);

  const { data: fullData, mutate: mutateFull } = useSWR<{ item: InformationDTO }>(
    `/api/information/${item.id}`,
    fetcher
  );

  function set<K extends keyof InformationDTO>(key: K, value: InformationDTO[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const { item: saved } = await apiPatch<{ item: InformationDTO }>(
        `/api/information/${item.id}`,
        {
          content: form.content,
          project: form.project ?? "",
          system: form.system ?? "",
          domain: form.domain ?? "",
          category: form.category,
          importance: form.importance,
          understandingLevel: form.understandingLevel,
          action: form.action,
          source: form.source ?? "",
          sourceDetail: form.sourceDetail ?? "",
          note: form.note ?? "",
        }
      );
      onSaved(saved);
      mutateFull();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  async function handleArchiveToggle() {
    const { item: saved } = await apiPatch<{ item: InformationDTO }>(
      `/api/information/${item.id}`,
      { archived: !form.archived }
    );
    setForm(saved);
    onSaved(saved);
  }

  async function handleDelete() {
    if (!confirm("この情報を削除しますか？この操作は取り消せません。")) return;
    await apiDelete(`/api/information/${item.id}`);
    onDeleted(item.id);
  }

  const nextActions: NextActionDTO[] = fullData?.item?.nextActions ?? [];

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">情報の詳細</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="閉じる">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <Field label="内容">
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-3 gap-2">
            <Field label="プロジェクト">
              <input value={form.project ?? ""} onChange={(e) => set("project", e.target.value)} className={inputCls} />
            </Field>
            <Field label="システム">
              <input value={form.system ?? ""} onChange={(e) => set("system", e.target.value)} className={inputCls} />
            </Field>
            <Field label="領域">
              <input value={form.domain ?? ""} onChange={(e) => set("domain", e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="カテゴリー">
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="重要度">
              <select value={form.importance} onChange={(e) => set("importance", e.target.value)} className={inputCls}>
                {IMPORTANCE_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="理解深度">
              <select
                value={form.understandingLevel}
                onChange={(e) => set("understandingLevel", e.target.value)}
                className={inputCls}
              >
                {UNDERSTANDING_LEVEL_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="今やること">
              <select value={form.action} onChange={(e) => set("action", e.target.value)} className={inputCls}>
                {ACTION_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="情報源">
              <select value={form.source ?? ""} onChange={(e) => set("source", e.target.value)} className={inputCls}>
                <option value="">未設定</option>
                {SOURCE_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="情報源詳細">
              <input
                value={form.sourceDetail ?? ""}
                onChange={(e) => set("sourceDetail", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="メモ">
            <textarea value={form.note ?? ""} onChange={(e) => set("note", e.target.value)} rows={2} className={inputCls} />
          </Field>

          {item.meeting && (
            <p className="text-xs text-blue-500">
              紐付く会議：{" "}
              <Link href={`/meetings/${item.meeting.id}`} className="underline">
                {item.meeting.title}
              </Link>
            </p>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "保存中…" : "保存"}
            </button>
            <button
              onClick={handleArchiveToggle}
              className="rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20"
            >
              {form.archived ? "復元" : "アーカイブ"}
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              削除
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-black/10 pt-4 dark:border-white/10">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Next Action</h3>
            <button
              onClick={() => setShowNextActionForm((v) => !v)}
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              + 追加
            </button>
          </div>

          {showNextActionForm && (
            <NextActionQuickForm
              informationId={item.id}
              onCreated={() => {
                setShowNextActionForm(false);
                mutateFull();
              }}
            />
          )}

          <ul className="space-y-1.5">
            {nextActions.length === 0 && (
              <li className="text-xs text-gray-400">Next Actionはまだありません</li>
            )}
            {nextActions.map((na) => (
              <li
                key={na.id}
                className="flex items-center justify-between rounded-lg border border-black/10 px-3 py-2 text-xs dark:border-white/10"
              >
                <div>
                  <p className="font-medium">{na.action}</p>
                  <p className="text-gray-400">
                    {na.owner || "担当未設定"}
                    {na.dueDate ? ` ・${na.dueDate.slice(0, 10)}まで` : ""}
                  </p>
                </div>
                <Badge label={na.status} colorClass={NEXT_ACTION_STATUS_COLORS[na.status]} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function NextActionQuickForm({
  informationId,
  onCreated,
}: {
  informationId: string;
  onCreated: () => void;
}) {
  const [action, setAction] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!action.trim()) return;
    setSubmitting(true);
    try {
      await apiPost("/api/next-actions", {
        action,
        owner: owner || undefined,
        dueDate: dueDate || undefined,
        informationId,
      });
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-3 space-y-2 rounded-lg border border-black/10 p-2.5 dark:border-white/10">
      <input
        value={action}
        onChange={(e) => setAction(e.target.value)}
        placeholder="何をする？"
        className={inputCls}
      />
      <div className="grid grid-cols-2 gap-2">
        <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="担当者" className={inputCls} />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitting || !action.trim()}
        className="w-full rounded-lg bg-blue-600 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
      >
        追加
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      {children}
    </div>
  );
}
