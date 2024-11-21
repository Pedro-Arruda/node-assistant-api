/*
  Warnings:

  - You are about to drop the column `access_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `databases` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "databases" DROP CONSTRAINT "databases_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "access_token",
ADD COLUMN     "notion_access_token" TEXT;

-- DropTable
DROP TABLE "databases";

-- CreateTable
CREATE TABLE "notion_databases" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notion_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notion_databases_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notion_databases" ADD CONSTRAINT "notion_databases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
