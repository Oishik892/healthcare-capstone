const prisma = require("../config/prisma");
const { updatePatientSchema } = require("../validators/patient.validator");

const getMyPatientProfile = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient profile fetched successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Get my patient profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateMyPatientProfile = async (req, res) => {
  try {
    const parsedData = updatePatientSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.flatten(),
      });
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { userId: req.user.userId },
    });

    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const { phone, address, gender, dateOfBirth } = parsedData.data;

    const updatedPatient = await prisma.patient.update({
      where: { userId: req.user.userId },
      data: {
        phone: phone ?? existingPatient.phone,
        address: address ?? existingPatient.address,
        gender: gender ?? existingPatient.gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : existingPatient.dateOfBirth,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Update my patient profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patientId = Number(req.params.id);

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
            role: true,
            createdAt: true,
          },
        },
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
      message: "Patient fetched successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Get patient by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getMyPatientProfile,
  updateMyPatientProfile,
  getPatientById,
};