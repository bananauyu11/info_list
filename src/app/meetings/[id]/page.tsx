"use client";

import { use } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher, apiDelete } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import MeetingNoteSection from "@/components/MeetingNoteSection";
import MeetingNextActionSection from "@/components/MeetingNextActionSection";
import QuickAddInformation from "@/components/QuickAddInformation";
import { ACTION_COLORS, IMPORTANCE_COLORS, MEETING_NOTE_TYPE_LABELS } from "@/lib/constants";
import { Badge } from "@/components/Badge";
import type { MeetingDTO } from "@/lib/types";

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, mutate } = useSWR<{ item: MeetingDTO }>(`/api/meetings/${id}`, fetcher);
  const meeting = data?.item;

  async function handleDeleteMeeting() {
    if (!meeting) return;
    if (!confirm(`「${meeting.title}」を削除しますか？紐付く情報・Next Actionの紐付けは解除されます。`)) return;
    await apiDelete(`/api/meetings/${id}`);
    router.push("/meetings");
  }

  if (!meeting) {
    return <div className="px-4 py-6 text-sm text-gray-400">読み込み中…</div>;
  }

  const notesByType = (type: string) => meeting.notes?.filter((n) => n.type === type) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/meetings" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
            ← 会議一覧
          </Link>
          <h1 className="text-lg font-bold">{meeting.title}</h1>
          <p className="text-xs text-gray-400">
            {meeting.project ? `${meeting.project} ・ ` : ""}
            {meeting.meetingDate ? new Date(meeting.meetingDate).toLocaleDateString("ja-JP") : ""}
          </p>
        </div>
        <button
          onClick={handleDeleteMeeting}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          会議を削除
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MeetingNoteSection
          meetingId={id}
          type="topic"
          label={MEETING_NOTE_TYPE_LABELS.topic}
          notes={notesByType("topic")}
          onChanged={() => mutate()}
        />
        <MeetingNoteSection
          meetingId={id}
          type="fact"
          label={MEETING_NOTE_TYPE_LABELS.fact}
          notes={notesByType("fact")}
          onChanged={() => mutate()}
        />
        <MeetingNoteSection
          meetingId={id}
          type="open_issue"
          label={MEETING_NOTE_TYPE_LABELS.open_issue}
          notes={notesByType("open_issue")}
          onChanged={() => mutate()}
        />
        <MeetingNoteSection
          meetingId={id}
          type="decision"
          label={MEETING_NOTE_TYPE_LABELS.decision}
          notes={notesByType("decision")}
          onChanged={() => mutate()}
        />
      </div>

      <MeetingNextActionSection
        meetingId={id}
        nextActions={meeting.nextActions ?? []}
        onChanged={() => mutate()}
      />

      <section className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/5">
        <h3 className="mb-2 text-sm font-semibold">■ 会議中に出た情報</h3>
        <QuickAddInformation defaultMeetingId={id} onAdded={() => mutate()} />
        <ul className="mt-3 space-y-1.5">
          {(meeting.informations ?? []).length === 0 && (
            <li className="text-xs text-gray-400">まだありません</li>
          )}
          {(meeting.informations ?? []).map((info) => (
            <li
              key={info.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
            >
              <Link href={`/information?q=${encodeURIComponent(info.content.slice(0, 20))}`} className="flex-1 hover:underline">
                {info.content}
              </Link>
              <div className="flex gap-1">
                <Badge label={info.importance} colorClass={IMPORTANCE_COLORS[info.importance]} />
                <Badge label={info.action} colorClass={ACTION_COLORS[info.action]} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
