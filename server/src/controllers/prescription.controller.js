const prisma = require("../config/prisma");
const { createPrescriptionSchema } = require("../validators/prescription.validator");

const createPrescription = async (req, res) => {
  try {
    const parsedData = createPrescriptionSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.flatten(),
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.userId },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const { patientId, appointmentId, diagnosis, notes, items } = parsedData.data;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      if (appointment.patientId !== patientId || appointment.doctorId !== doctor.id) {
        return res.status(403).json({
          success: false,
          message: "This appointment does not belong to this doctor and patient",
        });
      }
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId: doctor.id,
        appointmentId: appointmentId || null,
        diagnosis: diagnosis || null,
        notes: notes || null,
        items: {
          create: items.map((item) => ({
            medicineName: item.medicineName,
            dosage: item.dosage || null,
            frequency: item.frequency || null,
            duration: item.duration || null,
            instructions: item.instructions || null,
          })),
        },
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
        doctor: {
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
        items: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (error) {
    console.error("Create prescription error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyPatientPrescriptions = async (req, res) => {
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

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
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
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Patient prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    console.error("Get patient prescriptions error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyDoctorPrescriptions = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.userId },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { doctorId: doctor.id },
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
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Doctor prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    console.error("Get doctor prescriptions error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPrescriptionsByPatientId = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

    if (Number.isNaN(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient id",
      });
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId },
      include: {
        doctor: {
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
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Patient prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    console.error("Get prescriptions by patient id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const prescriptionId = Number(req.params.id);

    if (Number.isNaN(prescriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription id",
      });
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
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
        doctor: {
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
        items: true,
      },
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (req.user.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.userId },
      });

      if (!patient || patient.id !== prescription.patientId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this prescription",
        });
      }
    }

    if (req.user.role === "DOCTOR") {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.userId },
      });

      if (!doctor || doctor.id !== prescription.doctorId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this prescription",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Prescription fetched successfully",
      data: prescription,
    });
  } catch (error) {
    console.error("Get prescription by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createPrescription,
  getMyPatientPrescriptions,
  getMyDoctorPrescriptions,
  getPrescriptionsByPatientId,
  getPrescriptionById,
};