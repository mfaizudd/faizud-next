-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "featuredImage" TEXT;

-- RenameIndex
ALTER INDEX "Profile_userId_unique" RENAME TO "Profile_userId_key";
