-- CreateEnum
CREATE TYPE "MedicationLogStatus" AS ENUM ('TAKEN', 'SKIPPED', 'MISSED');

-- CreateTable
CREATE TABLE "MedicationReminder" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medicineName" TEXT NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT,
    "times" JSONB NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationLog" (
    "id" SERIAL NOT NULL,
    "reminderId" INTEGER NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "status" "MedicationLogStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicationLog_reminderId_logDate_idx" ON "MedicationLog"("reminderId", "logDate");

-- AddForeignKey
ALTER TABLE "MedicationReminder" ADD CONSTRAINT "MedicationReminder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationLog" ADD CONSTRAINT "MedicationLog_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "MedicationReminder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
