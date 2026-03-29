const { z } = require("zod");

const prescriptionItemSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  instructions: z.string().optional(),
});

const createPrescriptionSchema = z.object({
  patientId: z.number(),
  appointmentId: z.number().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(prescriptionItemSchema).min(1, "At least one medicine is required"),
});

module.exports = {
  createPrescriptionSchema,
};