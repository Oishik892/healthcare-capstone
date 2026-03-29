const prisma = require("../config/prisma");
const { uploadLabResultSchema } = require("../validators/labResult.validator");

const uploadLabResult = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Report file is required",
      });
    }

    const parsedData = uploadLabResultSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.flatten(),
      });
    }

    const { patientId, testName, resultSummary, reportDate } = parsedData.data;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const newLabResult = await prisma.labResult.create({
      data: {
        patientId,
        uploadedByUserId: req.user.userId,
        testName,
        resultSummary: resultSummary || null,
        fileUrl: `/uploads/lab-results/${req.file.filename}`,
        reportDate: reportDate ? new Date(reportDate) : new Date(),
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Lab result uploaded successfully",
      data: newLabResult,
    });
  } catch (error) {
    console.error("Upload lab result error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getMyLabResults = async (req, res) => {
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

    const labResults = await prisma.labResult.findMany({
      where: { patientId: patient.id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lab results fetched successfully",
      data: labResults,
    });
  } catch (error) {
    console.error("Get my lab results error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLabResultsByPatientId = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

    if (Number.isNaN(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient id",
      });
    }

    const labResults = await prisma.labResult.findMany({
      where: { patientId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Patient lab results fetched successfully",
      data: labResults,
    });
  } catch (error) {
    console.error("Get lab results by patient id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLabResultById = async (req, res) => {
  try {
    const labResultId = Number(req.params.id);

    if (Number.isNaN(labResultId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab result id",
      });
    }

    const labResult = await prisma.labResult.findUnique({
      where: { id: labResultId },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!labResult) {
      return res.status(404).json({
        success: false,
        message: "Lab result not found",
      });
    }

    if (req.user.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.userId },
      });

      if (!patient || patient.id !== labResult.patientId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this lab result",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Lab result fetched successfully",
      data: labResult,
    });
  } catch (error) {
    console.error("Get lab result by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  uploadLabResult,
  getMyLabResults,
  getLabResultsByPatientId,
  getLabResultById,
};