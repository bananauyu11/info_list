"use client";

import { useState, FormEvent } from "react";
import { apiPost } from "@/lib/fetcher";
import {
  ACTION_OPTIONS,
  CATEGORY_OPTIONS,
  IMPORTANCE_OPTIONS,
  SOURCE_OPTIONS,
  UNDERSTANDING_LEVEL_OPTIONS,
} from "@/lib/constants";
import type { InformationDTO } from "@/lib/types";

export default function QuickAddInformation({
  defaultMeetingId,
  onAdded,
  autoFocus,
}: {
  defaultMeetingId?: string;
  onAdded?: (item: InformationDTO) => void;
  autoFocus?: boolean;
}) {
  const [content, setContent] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [project, setProject] = useState("");
  const [system, setSystem] = useState("");
  const [domain, setDomain] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<string>("未分類");
  const [importance, setImportance] = useState<string>("未判定");
  const [understandingLevel, setUnderstandingLevel] = useState<string>("未判定");
  const [action, setAction] = useState<string>("未判定");
  const [source, setSource] = useState<string>("");
  const [sourceDetail, setSourceDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setContent("");
    setProject("");
    setSystem("");
    setDomain("");
    setNote("");
    setCategory("未分類");
    setImportance("未判定");
    setUnderstandingLevel("未判定");
    setAction("未判定");
    setSource("");
    setSourceDetail("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const { item } = await apiPost<{ item: InformationDTO }>("/api/information", {
        content,
        project: project || undefined,
        system: system || undefined,
        domain: domain || undefined,
        note: note || undefined,
        category,
        importance,
        understandingLevel,
        action,
        source: source || undefined,
        sourceDetail: sourceDetail || undefined,
        meetingId: defaultMeetingId,
      });
      reset();
      onAdded?.(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : "追加に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
        何を知った？
      </label>
      <div className="flex gap-2">
        <input
          autoFocus={autoFocus}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="例：Aシステムの○○機能は次回リリース対象外"
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent"
        />
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          追加
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowDetail((v) => !v)}
        className="mt-2 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        {showDetail ? "詳細を閉じる ▲" : "詳細設定 ▼"}
      </button>

      {showDetail && (
        <div className="mt-3 grid grid-cols-1 gap-3 border-t border-black/10 pt-3 sm:grid-cols-2 dark:border-white/10">
          <Field label="プロジェクト">
            <input value={project} onChange={(e) => setProject(e.target.value)} className={inputCls} />
          </Field>
          <Field label="システム">
            <input value={system} onChange={(e) => setSystem(e.target.value)} className={inputCls} />
          </Field>
          <Field label="領域">
            <input value={domain} onChange={(e) => setDomain(e.target.value)} className={inputCls} />
          </Field>
          <Field label="カテゴリー">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="重要度">
            <select value={importance} onChange={(e) => setImportance(e.target.value)} className={inputCls}>
              {IMPORTANCE_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="理解深度">
            <select value={understandingLevel} onChange={(e) => setUnderstandingLevel(e.target.value)} className={inputCls}>
              {UNDERSTANDING_LEVEL_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="今やること">
            <select value={action} onChange={(e) => setAction(e.target.value)} className={inputCls}>
              {ACTION_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="情報源">
            <select value={source} onChange={(e) => setSource(e.target.value)} className={inputCls}>
              <option value="">選択しない</option>
              {SOURCE_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="情報源詳細">
            <input
              value={sourceDetail}
              onChange={(e) => setSourceDetail(e.target.value)}
              placeholder="例：○○定例 / 山田さん"
              className={inputCls}
            />
          </Field>
          <Field label="メモ" className="sm:col-span-2">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={inputCls} />
          </Field>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-black/15 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-white/20 dark:bg-transparent";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}
