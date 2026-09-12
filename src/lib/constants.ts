// 情報一覧・会議・Next Action で使う選択肢の定義。
// SQLiteはネイティブenumを持たないため、文字列 + アプリ側バリデーションで管理する。

export const CATEGORY_OPTIONS = [
  "未分類",
  "プロジェクト概要",
  "体制・関係者",
  "担当領域",
  "進捗・スケジュール",
  "課題",
  "リスク",
  "未決事項",
  "意思決定",
  "変更事項",
  "会議・コミュニケーション",
  "成果物・ドキュメント",
  "プロジェクト運営",
  "過去・経緯",
  "その他",
] as const;

export const IMPORTANCE_OPTIONS = ["未判定", "A", "B", "C"] as const;

export const UNDERSTANDING_LEVEL_OPTIONS = [
  "未判定",
  "Lv.1",
  "Lv.2",
  "Lv.3",
] as const;

export const ACTION_OPTIONS = [
  "未判定",
  "対応",
  "共有・確認",
  "タスク化",
  "深掘り",
  "Knowledge化",
  "保留",
  "なし",
] as const;

export const SOURCE_OPTIONS = [
  "会議",
  "チャット",
  "資料",
  "人から聞いた",
  "自分で調査",
  "その他",
] as const;

export const NEXT_ACTION_STATUS_OPTIONS = [
  "未着手",
  "対応中",
  "完了",
  "保留",
] as const;

export const MEETING_NOTE_TYPES = [
  "topic",
  "fact",
  "open_issue",
  "decision",
] as const;

export const MEETING_NOTE_TYPE_LABELS: Record<
  (typeof MEETING_NOTE_TYPES)[number],
  string
> = {
  topic: "論点",
  fact: "事実・前提",
  open_issue: "未決事項",
  decision: "決定事項",
};

export type Category = (typeof CATEGORY_OPTIONS)[number];
export type Importance = (typeof IMPORTANCE_OPTIONS)[number];
export type UnderstandingLevel = (typeof UNDERSTANDING_LEVEL_OPTIONS)[number];
export type ActionType = (typeof ACTION_OPTIONS)[number];
export type Source = (typeof SOURCE_OPTIONS)[number];
export type NextActionStatus = (typeof NEXT_ACTION_STATUS_OPTIONS)[number];
export type MeetingNoteType = (typeof MEETING_NOTE_TYPES)[number];

export const UNSORTED_CATEGORY = "未分類";
export const UNJUDGED_IMPORTANCE = "未判定";
export const UNJUDGED_UNDERSTANDING = "未判定";
export const UNJUDGED_ACTION = "未判定";

// 「未整理」とみなす条件：分類・重要度・理解度・Actionのいずれかが未設定のまま
export function isUnsorted(info: {
  category: string;
  importance: string;
  understandingLevel: string;
  action: string;
}) {
  return (
    info.category === UNSORTED_CATEGORY ||
    info.importance === UNJUDGED_IMPORTANCE ||
    info.understandingLevel === UNJUDGED_UNDERSTANDING ||
    info.action === UNJUDGED_ACTION
  );
}

export const IMPORTANCE_COLORS: Record<string, string> = {
  A: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  B: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  C: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  未判定: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export const ACTION_COLORS: Record<string, string> = {
  対応: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "共有・確認":
    "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  タスク化:
    "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  深掘り: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  Knowledge化:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  保留: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  なし: "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
  未判定: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export const NEXT_ACTION_STATUS_COLORS: Record<string, string> = {
  未着手: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  対応中: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  完了: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  保留: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};
