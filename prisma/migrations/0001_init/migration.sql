-- Initial schema for JURNAL PKL
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SISWA', 'PEMBIMBING');
CREATE TYPE "JournalStatus" AS ENUM ('DRAFT', 'MENUNGGU_PERSETUJUAN', 'DISETUJUI', 'PERLU_REVISI');
CREATE TYPE "ApprovalStatus" AS ENUM ('DISETUJUI', 'PERLU_REVISI');
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'JURNAL', 'APPROVAL', 'REVISI', 'PENGINGAT');

CREATE TABLE "User" (
  "id" SERIAL NOT NULL,
  "username" TEXT NOT NULL,
  "nama" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'SISWA',
  "kelas" TEXT,
  "jurusan" TEXT,
  "sekolah" TEXT,
  "tempat_pkl" TEXT,
  "pembimbing" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Shift" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "start_time" TEXT NOT NULL,
  "end_time" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Journal" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "shift_id" INTEGER NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "start_time" TEXT NOT NULL,
  "end_time" TEXT NOT NULL,
  "activity" TEXT NOT NULL,
  "description" TEXT,
  "status" "JournalStatus" NOT NULL DEFAULT 'DRAFT',
  "supervisor_note" TEXT,
  "approved_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Notification" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL DEFAULT 'JURNAL',
  "is_read" BOOLEAN NOT NULL DEFAULT false,
  "scheduled_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SupervisorApproval" (
  "id" SERIAL NOT NULL,
  "journal_id" INTEGER NOT NULL,
  "supervisor_name" TEXT NOT NULL,
  "status" "ApprovalStatus" NOT NULL,
  "note" TEXT,
  "approved_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SupervisorApproval_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "Journal_user_id_date_idx" ON "Journal"("user_id", "date");
CREATE INDEX "Journal_status_idx" ON "Journal"("status");
CREATE INDEX "Notification_user_id_is_read_idx" ON "Notification"("user_id", "is_read");
CREATE INDEX "SupervisorApproval_journal_id_idx" ON "SupervisorApproval"("journal_id");

ALTER TABLE "Journal" ADD CONSTRAINT "Journal_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_shift_id_fkey"
  FOREIGN KEY ("shift_id") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupervisorApproval" ADD CONSTRAINT "SupervisorApproval_journal_id_fkey"
  FOREIGN KEY ("journal_id") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
