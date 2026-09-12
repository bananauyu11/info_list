export interface InformationDTO {
  id: string;
  content: string;
  project: string | null;
  system: string | null;
  domain: string | null;
  category: string;
  importance: string;
  understandingLevel: string;
  action: string;
  source: string | null;
  sourceDetail: string | null;
  note: string | null;
  archived: boolean;
  meetingId: string | null;
  meeting?: { id: string; title: string } | null;
  nextActions?: NextActionDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface MeetingNoteDTO {
  id: string;
  meetingId: string;
  type: "topic" | "fact" | "open_issue" | "decision";
  content: string;
  order: number;
  createdAt: string;
}

export interface NextActionDTO {
  id: string;
  action: string;
  owner: string | null;
  dueDate: string | null;
  status: string;
  meetingId: string | null;
  informationId: string | null;
  meeting?: { id: string; title: string } | null;
  information?: { id: string; content: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingDTO {
  id: string;
  title: string;
  project: string | null;
  meetingDate: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: MeetingNoteDTO[];
  informations?: InformationDTO[];
  nextActions?: NextActionDTO[];
  _count?: { informations: number; nextActions: number; notes: number };
}
