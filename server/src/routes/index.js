const express = require("express");
const router = express.Router();

const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const patientRoutes = require("./patient.routes");
const doctorRoutes = require("./doctor.routes");
const adminRoutes = require("./admin.routes");
const appointmentRoutes = require("./appointment.routes");
const medicalHistoryRoutes = require("./medicalHistory.routes");
const prescriptionRoutes = require("./prescription.routes");
const labResultRoutes = require("./labResult.routes");
const medicationReminderRoutes = require("./medicationReminder.routes");

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/admin", adminRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/medical-history", medicalHistoryRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/lab-results", labResultRoutes);
router.use("/medication-reminders", medicationReminderRoutes);

module.exports = router;