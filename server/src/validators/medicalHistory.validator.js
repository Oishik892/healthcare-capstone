const { z } = require("zod");

const upsertMedicalHistorySchema = z.object({
  conditions: z.string().optional(),
  allergies: z.string().optional(),
  surgeries: z.string().optional(),
  notes: z.string().optional(),
});

module.exports = {
  upsertMedicalHistorySchema,
};