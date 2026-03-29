const prisma = require("../config/prisma");
const {
  createMedicationReminderSchema,
  updateMedicationReminderSchema,
  medicationLogSchema,
} = require("../validators/medicationReminder.validator");

const getPatientFromToken = async (userId) => {
  return prisma.patient.findUnique({
    where: { userId },
  });
};

const createMedicationReminder = async (req, res) => {
  try {
    const parsedData = createMedicationReminderSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.flatten(),
      });
    }

    const patient = await getPatientFromToken(req.user.userId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const { medicineName, dosage, frequency, times, startDate, endDate, notes } = parsedData.data;

    const reminder = await prisma.medicationReminder.create({
      data: {
        patientId: patient.id,
        medicineName,
        dosage: dosage || null,
        frequency: frequency || null,
        times,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        notes: notes || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Medication reminder created successfully",
      data: reminder,
    });
  } catch (error) {
    console.error("Create medication reminder error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyMedicationReminders = async (req, res) => {
  try {
    const patient = await getPatientFromToken(req.user.userId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const reminders = await prisma.medicationReminder.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Medication reminders fetched successfully",
      data: reminders,
    });
  } catch (error) {
    console.error("Get medication reminders error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyTodayMedicationReminders = async (req, res) => {
  try {
    const patient = await getPatientFromToken(req.user.userId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const reminders = await prisma.medicationReminder.findMany({
      where: {
        patientId: patient.id,
        isActive: true,
        startDate: { lte: endOfToday },
        OR: [
          { endDate: null },
          { endDate: { gte: startOfToday } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        logs: {
          where: {
            logDate: {
              gte: startOfToday,
              lte: endOfToday,
            },
          },
          orderBy: { logDate: "desc" },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Today's medication reminders fetched successfully",
      data: reminders,
    });
  } catch (error) {
    console.error("Get today medication reminders error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateMedicationReminder = async (req, res) => {
  try {
    const reminderId = Number(req.params.id);

    if (Number.isNaN(reminderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder id",
      });
    }

    const parsedData = updateMedicationReminderSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.flatten(),
      });
    }

    const patient = await getPatientFromToken(req.user.userId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const reminder = await prisma.medicationReminder.findUnique({
      where: { id: reminderId },
    });

    if (!reminder || reminder.patientId !== patient.id) {
      return res.status(404).json({
        success: false,
        message: "Medication reminder not found",
      });
    }

    const data = parsedData.data;

    const updatedReminder = await prisma.medicationReminder.update({
      where: { id: reminderId },
      data: {
        medicineName: data.medicineName ?? reminder.medicineName,
        dosage: data.dosage ?? reminder.dosage,
        frequency: data.frequency ?? reminder.frequency,
        times: data.times ?? reminder.times,
        startDate: data.startDate ? new Date(data.startDate) : reminder.startDate,
        endDate: data.endDate ? new Date(data.endDate) : reminder.endDate,
        notes: data.notes ?? reminder.notes,
        isActive: data.isActive ?? reminder.isActive,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Medication reminder updated successfully",
      data: updatedReminder,
    });
  } catch (error) {
    console.error("Update medication reminder error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteMedicationReminder = async (req, res) => {
  try {
    const reminderId = Number(req.params.id);

    if (Number.isNaN(reminderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder id",
      });
    }

    const patient = await getPatientFromToken(req.user.userId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const reminder = await prisma.medicationReminder.findUnique({
      where: { id: reminderId },
    });

    if (!reminder || reminder.patientId !== patient.id) {
      return res.status(404).json({
        success: false,
        message: "Medication reminder not found",
      });
    }

    await prisma.medicationReminder.delete({
      where: { id: reminderId },
    });

    return res.status(200).json({
      success: true,
      message: "Medication reminder deleted successfully",
    });
  } catch (error) {
    console.error("Delete medication reminder error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logMedicationStatus = async (req, res) => {
  try {
    const reminderId = Number(req.params.id);

    if (Number.isNaN(reminderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder id",
      });
    }

    const parsedData = medicationLogSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.flatten(),
      });
    }

    const patient = await getPatientFromToken(req.user.userId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const reminder = await prisma.medicationReminder.findUnique({
      where: { id: reminderId },
    });

    if (!reminder || reminder.patientId !== patient.id) {
      return res.status(404).json({
        success: false,
        message: "Medication reminder not found",
      });
    }

    const { status, logDate, note } = parsedData.data;

    const log = await prisma.medicationLog.create({
      data: {
        reminderId,
        status,
        logDate: logDate ? new Date(logDate) : new Date(),
        note: note || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Medication log saved successfully",
      data: log,
    });
  } catch (error) {
    console.error("Log medication status error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMedicationLogs = async (req, res) => {
  try {
    const reminderId = Number(req.params.id);

    if (Number.isNaN(reminderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder id",
      });
    }

    const patient = await getPatientFromToken(req.user.userId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const reminder = await prisma.medicationReminder.findUnique({
      where: { id: reminderId },
    });

    if (!reminder || reminder.patientId !== patient.id) {
      return res.status(404).json({
        success: false,
        message: "Medication reminder not found",
      });
    }

    const logs = await prisma.medicationLog.findMany({
      where: { reminderId },
      orderBy: { logDate: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Medication logs fetched successfully",
      data: logs,
    });
  } catch (error) {
    console.error("Get medication logs error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPatientMedicationReminders = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

    if (Number.isNaN(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient id",
      });
    }

    const reminders = await prisma.medicationReminder.findMany({
      where: { patientId },
      include: {
        logs: {
          orderBy: { logDate: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Patient medication reminders fetched successfully",
      data: reminders,
    });
  } catch (error) {
    console.error("Get patient medication reminders error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createMedicationReminder,
  getMyMedicationReminders,
  getMyTodayMedicationReminders,
  updateMedicationReminder,
  deleteMedicationReminder,
  logMedicationStatus,
  getMedicationLogs,
  getPatientMedicationReminders,
};