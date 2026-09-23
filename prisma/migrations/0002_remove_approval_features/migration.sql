-- Remove legacy journal approval data while preserving journal records.
UPDATE "Journal" SET "status" = 'DRAFT'
WHERE "status" IN ('MENUNGGU_PERSETUJUAN', 'DISETUJUI', 'PERLU_REVISI');

UPDATE "Notification" SET "type" = 'JURNAL'
WHERE "type" IN ('APPROVAL', 'REVISI');

ALTER TABLE "Journal" DROP COLUMN IF EXISTS "supervisor_note";
ALTER TABLE "Journal" DROP COLUMN IF EXISTS "approved_at";
DROP TABLE IF EXISTS "SupervisorApproval";

ALTER TABLE "Journal" ALTER COLUMN "status" DROP DEFAULT;
CREATE TYPE "JournalStatus_new" AS ENUM ('DRAFT', 'TERKIRIM');
ALTER TABLE "Journal"
  ALTER COLUMN "status" TYPE "JournalStatus_new"
  USING (
    CASE
      WHEN "status"::text = 'TERKIRIM' THEN 'TERKIRIM'::"JournalStatus_new"
      ELSE 'DRAFT'::"JournalStatus_new"
    END
  );
DROP TYPE "JournalStatus";
ALTER TYPE "JournalStatus_new" RENAME TO "JournalStatus";
ALTER TABLE "Journal" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

CREATE TYPE "NotificationType_new" AS ENUM ('SYSTEM', 'JURNAL', 'PENGINGAT');
ALTER TABLE "Notification"
  ALTER COLUMN "type" DROP DEFAULT,
  ALTER COLUMN "type" TYPE "NotificationType_new"
  USING (
    CASE
      WHEN "type"::text = 'SYSTEM' THEN 'SYSTEM'::"NotificationType_new"
      WHEN "type"::text = 'PENGINGAT' THEN 'PENGINGAT'::"NotificationType_new"
      ELSE 'JURNAL'::"NotificationType_new"
    END
  );
DROP TYPE "NotificationType";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
ALTER TABLE "Notification" ALTER COLUMN "type" SET DEFAULT 'JURNAL';
DROP TYPE IF EXISTS "ApprovalStatus";
