/*
  Warnings:

  - You are about to drop the column `brand` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `fuelType` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `mileage` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `ServiceRecord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `make` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_vehicleId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "brand",
DROP COLUMN "fuelType",
DROP COLUMN "mileage",
DROP COLUMN "year",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "make" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "ServiceRecord";
