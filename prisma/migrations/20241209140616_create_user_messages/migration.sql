/*
  Warnings:

  - You are about to drop the `notion_pages_genres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "notion_pages_genres" DROP CONSTRAINT "notion_pages_genres_user_id_fkey";

-- DropTable
DROP TABLE "notion_pages_genres";

-- CreateTable
CREATE TABLE "user_messages" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_messages" ADD CONSTRAINT "user_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
