/*
  Warnings:

  - Added the required column `material_icon` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "material_icon" TEXT NOT NULL;
