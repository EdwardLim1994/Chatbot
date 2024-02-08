-- DropForeignKey
ALTER TABLE "contexts" DROP CONSTRAINT "contexts_user_id_fkey";

-- AddForeignKey
ALTER TABLE "contexts" ADD CONSTRAINT "contexts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
