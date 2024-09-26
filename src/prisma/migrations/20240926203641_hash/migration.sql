-- AlterTable
ALTER TABLE "File" ADD COLUMN     "currentVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currenthash" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "FileVersion" ADD COLUMN     "hash" TEXT NOT NULL DEFAULT '';
