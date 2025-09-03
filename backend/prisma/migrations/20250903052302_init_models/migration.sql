/*
  Warnings:

  - The `status` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."VehicleStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."TripType" AS ENUM ('BUSINESS', 'PERSONAL');

-- AlterTable
ALTER TABLE "public"."Trip" ADD COLUMN     "type" "public"."TripType" NOT NULL DEFAULT 'BUSINESS';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "public"."Vehicle" DROP COLUMN "status",
ADD COLUMN     "status" "public"."VehicleStatus" NOT NULL DEFAULT 'ACTIVE';
