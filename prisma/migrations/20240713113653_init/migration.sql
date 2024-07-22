/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nik]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nik]` on the table `Pharmacist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_nik_key" ON "Admin"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_nik_key" ON "Doctor"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacist_nik_key" ON "Pharmacist"("nik");
