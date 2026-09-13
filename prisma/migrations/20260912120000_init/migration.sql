-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Information" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "project" TEXT,
    "system" TEXT,
    "domain" TEXT,
    "category" TEXT NOT NULL DEFAULT '未分類',
    "importance" TEXT NOT NULL DEFAULT '未判定',
    "understandingLevel" TEXT NOT NULL DEFAULT '未判定',
    "action" TEXT NOT NULL DEFAULT '未判定',
    "source" TEXT,
    "sourceDetail" TEXT,
    "note" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "meetingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "project" TEXT,
    "meetingDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingNote" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetingNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NextAction" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "owner" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT '未着手',
    "meetingId" TEXT,
    "informationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NextAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Information_meetingId_idx" ON "Information"("meetingId");

-- CreateIndex
CREATE INDEX "Information_archived_idx" ON "Information"("archived");

-- CreateIndex
CREATE INDEX "Information_category_idx" ON "Information"("category");

-- CreateIndex
CREATE INDEX "Information_importance_idx" ON "Information"("importance");

-- CreateIndex
CREATE INDEX "Information_understandingLevel_idx" ON "Information"("understandingLevel");

-- CreateIndex
CREATE INDEX "Information_action_idx" ON "Information"("action");

-- CreateIndex
CREATE INDEX "Information_project_idx" ON "Information"("project");

-- CreateIndex
CREATE INDEX "MeetingNote_meetingId_type_idx" ON "MeetingNote"("meetingId", "type");

-- CreateIndex
CREATE INDEX "NextAction_meetingId_idx" ON "NextAction"("meetingId");

-- CreateIndex
CREATE INDEX "NextAction_informationId_idx" ON "NextAction"("informationId");

-- CreateIndex
CREATE INDEX "NextAction_status_idx" ON "NextAction"("status");

-- AddForeignKey
ALTER TABLE "Information" ADD CONSTRAINT "Information_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingNote" ADD CONSTRAINT "MeetingNote_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextAction" ADD CONSTRAINT "NextAction_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextAction" ADD CONSTRAINT "NextAction_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "Information"("id") ON DELETE SET NULL ON UPDATE CASCADE;

