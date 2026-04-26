/*
  Warnings:

  - Added the required column `senderId` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "senderId" TEXT NOT NULL;
