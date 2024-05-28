-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SaludFisica', 'SaludMental', 'Alimentacion');

-- CreateEnum
CREATE TYPE "CategoryInstruction" AS ENUM ('Inicio', 'MisHabitos', 'Diario', 'Calendario');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Habito', 'Evento');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('Bueno', 'Normal', 'Mal');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('VecesAlDia', 'Litros', 'Pasos', 'Minutos', 'Horas');

-- CreateEnum
CREATE TYPE "HabitStatus" AS ENUM ('SinIniciar', 'EnProceso', 'Forjado', 'Interiorizado');

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "default_color" TEXT NOT NULL,
    "text_color" TEXT NOT NULL DEFAULT 'white',
    "programmable" BOOLEAN NOT NULL,
    "allday" BOOLEAN NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "tips" TEXT[],

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instruction" (
    "id" TEXT NOT NULL,
    "category" "CategoryInstruction" NOT NULL,
    "instruction" TEXT[],

    CONSTRAINT "Instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Completes" (
    "id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Completes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diary" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "mood" "Mood" NOT NULL,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "unit" "UnitType" NOT NULL,
    "goals" JSONB NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHabit" (
    "id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "HabitStatus" NOT NULL,
    "current_streak" INTEGER NOT NULL,
    "best_streak" INTEGER NOT NULL,
    "times_forged" INTEGER NOT NULL,
    "times_forged_goal" INTEGER NOT NULL,
    "settings" JSONB NOT NULL,

    CONSTRAINT "UserHabit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Habit_name_key" ON "Habit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Completes_habit_id_user_id_date_key" ON "Completes"("habit_id", "user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Diary_user_id_date_key" ON "Diary"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Completes" ADD CONSTRAINT "Completes_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Completes" ADD CONSTRAINT "Completes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabit" ADD CONSTRAINT "UserHabit_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHabit" ADD CONSTRAINT "UserHabit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
