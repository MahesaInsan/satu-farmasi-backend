/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Medicine` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UnitOfMeasure" ADD VALUE 'GRAM';
ALTER TYPE "UnitOfMeasure" ADD VALUE 'LITER';
ALTER TYPE "UnitOfMeasure" ADD VALUE 'GROS';
ALTER TYPE "UnitOfMeasure" ADD VALUE 'KODI';
ALTER TYPE "UnitOfMeasure" ADD VALUE 'RIM';
ALTER TYPE "UnitOfMeasure" ADD VALUE 'PCS';

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_code_key" ON "Medicine"("code");
