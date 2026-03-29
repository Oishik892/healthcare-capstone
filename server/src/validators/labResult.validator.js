const { z } = require("zod");

const uploadLabResultSchema = z.object({
  patientId: z.coerce.number(),
  testName: z.string().min(1, "Test name is required"),
  resultSummary: z.string().optional(),
  reportDate: z.string().optional(),
});

module.exports = {
  uploadLabResultSchema,
};