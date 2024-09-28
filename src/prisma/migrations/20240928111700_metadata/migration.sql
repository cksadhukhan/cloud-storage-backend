-- AlterTable
ALTER TABLE "File" ADD COLUMN     "description" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "type" TEXT;

-- CreateTable
CREATE TABLE "Metadata" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metadata_fileId_key_key" ON "Metadata"("fileId", "key");

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
