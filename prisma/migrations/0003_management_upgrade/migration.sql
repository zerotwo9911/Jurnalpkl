CREATE TABLE "TempatPkl" (
  "id" SERIAL NOT NULL,
  "nama" TEXT NOT NULL,
  "alamat" TEXT,
  "kontak" TEXT,
  "penanggung_jawab" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TempatPkl_pkey" PRIMARY KEY ("id")
);
DROP TABLE IF EXISTS "Notification";
DROP TYPE IF EXISTS "NotificationType";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tempat_pkl_id" INTEGER;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pembimbing_id" INTEGER;
ALTER TABLE "Shift" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true;
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_pembimbing_id_idx" ON "User"("pembimbing_id");
CREATE INDEX IF NOT EXISTS "User_tempat_pkl_id_idx" ON "User"("tempat_pkl_id");
CREATE INDEX IF NOT EXISTS "TempatPkl_nama_idx" ON "TempatPkl"("nama");
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='User_tempat_pkl_id_fkey') THEN
   ALTER TABLE "User" ADD CONSTRAINT "User_tempat_pkl_id_fkey" FOREIGN KEY ("tempat_pkl_id") REFERENCES "TempatPkl"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='User_pembimbing_id_fkey') THEN
   ALTER TABLE "User" ADD CONSTRAINT "User_pembimbing_id_fkey" FOREIGN KEY ("pembimbing_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
END $$;
INSERT INTO "TempatPkl" ("nama","created_at","updated_at") SELECT DISTINCT "tempat_pkl", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "User" WHERE "tempat_pkl" IS NOT NULL AND "tempat_pkl" <> '' AND NOT EXISTS (SELECT 1 FROM "TempatPkl" p WHERE p."nama"="User"."tempat_pkl");
UPDATE "User" u SET "tempat_pkl_id"=p."id" FROM "TempatPkl" p WHERE u."tempat_pkl"=p."nama" AND u."tempat_pkl_id" IS NULL;
UPDATE "User" s SET "pembimbing_id"=p."id" FROM "User" p WHERE s."pembimbing"=p."nama" AND p."role"='PEMBIMBING' AND s."pembimbing_id" IS NULL;
