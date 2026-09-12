import { z } from "zod";
import {
  ACTION_OPTIONS,
  CATEGORY_OPTIONS,
  IMPORTANCE_OPTIONS,
  MEETING_NOTE_TYPES,
  NEXT_ACTION_STATUS_OPTIONS,
  SOURCE_OPTIONS,
  UNDERSTANDING_LEVEL_OPTIONS,
} from "./constants";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const informationCreateSchema = z.object({
  content: z.string().trim().min(1, "内容を入力してください"),
  project: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  system: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  domain: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  category: z.enum(CATEGORY_OPTIONS).optional(),
  importance: z.enum(IMPORTANCE_OPTIONS).optional(),
  understandingLevel: z.enum(UNDERSTANDING_LEVEL_OPTIONS).optional(),
  action: z.enum(ACTION_OPTIONS).optional(),
  source: z.preprocess(
    emptyToUndefined,
    z.enum(SOURCE_OPTIONS).optional().or(z.string().trim().optional())
  ),
  sourceDetail: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  note: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  meetingId: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});

export const informationUpdateSchema = informationCreateSchema
  .partial()
  .extend({
    archived: z.boolean().optional(),
  });

export const meetingCreateSchema = z.object({
  title: z.string().trim().min(1, "会議名を入力してください"),
  project: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  meetingDate: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});

export const meetingNoteCreateSchema = z.object({
  type: z.enum(MEETING_NOTE_TYPES),
  content: z.string().trim().min(1, "内容を入力してください"),
});

export const nextActionCreateSchema = z.object({
  action: z.string().trim().min(1, "アクションを入力してください"),
  owner: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  dueDate: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  status: z.enum(NEXT_ACTION_STATUS_OPTIONS).optional(),
  meetingId: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  informationId: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});

export const nextActionUpdateSchema = nextActionCreateSchema.partial();
