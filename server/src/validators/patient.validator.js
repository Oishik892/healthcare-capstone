const { z } = require("zod");

const updatePatientSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

module.exports = {
  updatePatientSchema,
};