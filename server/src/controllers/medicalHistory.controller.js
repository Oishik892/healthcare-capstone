const prisma = require("../config/prisma");
const { upsertMedicalHistorySchema } = require("../validators/medicalHistory.validator");

const getMyMedicalHistory = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.userId },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const medicalHistory = await prisma.medicalHistory.findUnique({
      where: { patientId: patient.id },
    });

    return res.status(200).json({
      success: true,
      message: "Medical history fetched successfully",
      data: medicalHistory,
    });
  } catch (error) {
    console.error("Get my medical history error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const upsertMyMedicalHistory = async (req, res) => {
  try {
    const parsedData = upsertMedicalHistorySchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.flatten(),
      });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.userId },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const { conditions, allergies, surgeries, notes } = parsedData.data;

    const medicalHistory = await prisma.medicalHistory.upsert({
      where: { patientId: patient.id },
      update: {
        conditions: conditions ?? undefined,
        allergies: allergies ?? undefined,
        surgeries: surgeries ?? undefined,
        notes: notes ?? undefined,
      },
      create: {
        patientId: patient.id,
        conditions: conditions || null,
        allergies: allergies || null,
        surgeries: surgeries || null,
        notes: notes || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Medical history saved successfully",
      data: medicalHistory,
    });
  } catch (error) {
    console.error("Upsert medical history error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMedicalHistoryByPatientId = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

    if (Number.isNaN(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient id",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        medicalHistory: true,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient medical history fetched successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Get medical history by patient id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getMyMedicalHistory,
  upsertMyMedicalHistory,
  getMedicalHistoryByPatientId,
};