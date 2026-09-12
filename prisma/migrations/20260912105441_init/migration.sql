-- CreateTable
CREATE TABLE "Information" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Information_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "project" TEXT,
    "meetingDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MeetingNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "meetingId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MeetingNote_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NextAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "owner" TEXT,
    "dueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT '未着手',
    "meetingId" TEXT,
    "informationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NextAction_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "NextAction_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "Information" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
