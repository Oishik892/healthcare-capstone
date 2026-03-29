const { z } = require("zod");

const updateDoctorSchema = z.object({
  specialization: z.string().optional(),
  qualification: z.string().optional(),
});

module.exports = {
  updateDoctorSchema,
};