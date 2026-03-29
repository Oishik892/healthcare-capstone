const { z } = require("zod");

const createMedicationReminderSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  times: z.array(z.string()).min(1, "At least one reminder time is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

const updateMedicationReminderSchema = z.object({
  medicineName: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  times: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

const medicationLogSchema = z.object({
  status: z.enum(["TAKEN", "SKIPPED", "MISSED"]),
  logDate: z.string().optional(),
  note: z.string().optional(),
});

module.exports = {
  createMedicationReminderSchema,
  updateMedicationReminderSchema,
  medicationLogSchema,
};