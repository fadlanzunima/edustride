/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isProfilePublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "level" SET DEFAULT 'SMA';

-- CreateTable
CREATE TABLE "SharedPortfolio" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedPortfolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SharedPortfolio_userId_idx" ON "SharedPortfolio"("userId");

-- CreateIndex
CREATE INDEX "SharedPortfolio_shareToken_idx" ON "SharedPortfolio"("shareToken");

-- CreateIndex
CREATE INDEX "SharedPortfolio_isActive_idx" ON "SharedPortfolio"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "User_shareToken_key" ON "User"("shareToken");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_shareToken_idx" ON "User"("shareToken");

-- AddForeignKey
ALTER TABLE "SharedPortfolio" ADD CONSTRAINT "SharedPortfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPortfolio" ADD CONSTRAINT "SharedPortfolio_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
