const prisma = require("../config/prisma");
const {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} = require("../validators/appointment.validator");

const createAppointment = async (req, res) => {
  try {
    const parsedData = createAppointmentSchema.safeParse(req.body);

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

    const { doctorId, appointmentDate, reason } = parsedData.data;

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        reason: reason || null,
        status: "PENDING",
      },
      include: {
        patient: {
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
        },
        doctor: {
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
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyPatientAppointments = async (req, res) => {
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

    const appointments = await prisma.appointment.findMany({
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
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Patient appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Get patient appointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyDoctorAppointments = async (req, res) => {
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

    const appointments = await prisma.appointment.findMany({
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
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Get doctor appointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);

    if (Number.isNaN(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment id",
      });
    }

    const parsedData = updateAppointmentStatusSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.flatten(),
      });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (req.user.role === "DOCTOR") {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.userId },
      });

      if (!doctor || doctor.id !== appointment.doctorId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to update this appointment",
        });
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: parsedData.data.status,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);

    if (Number.isNaN(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment id",
      });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (req.user.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.userId },
      });

      if (!patient || patient.id !== appointment.patientId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to cancel this appointment",
        });
      }
    }

    const deletedAppointment = await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: deletedAppointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAppointment,
  getMyPatientAppointments,
  getMyDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};