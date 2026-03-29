const { z } = require("zod");

const createAppointmentSchema = z.object({
  doctorId: z.number(),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  reason: z.string().optional(),
});

const updateAppointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
});

module.exports = {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
};