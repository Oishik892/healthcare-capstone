const express = require("express");
const router = express.Router();

const {
  createMedicationReminder,
  getMyMedicationReminders,
  getMyTodayMedicationReminders,
  updateMedicationReminder,
  deleteMedicationReminder,
  logMedicationStatus,
  getMedicationLogs,
  getPatientMedicationReminders,
} = require("../controllers/medicationReminder.controller");

const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

router.post("/", verifyToken, authorizeRoles("PATIENT"), createMedicationReminder);
router.get("/mine", verifyToken, authorizeRoles("PATIENT"), getMyMedicationReminders);
router.get("/mine/today", verifyToken, authorizeRoles("PATIENT"), getMyTodayMedicationReminders);
router.patch("/:id", verifyToken, authorizeRoles("PATIENT"), updateMedicationReminder);
router.delete("/:id", verifyToken, authorizeRoles("PATIENT"), deleteMedicationReminder);
router.post("/:id/logs", verifyToken, authorizeRoles("PATIENT"), logMedicationStatus);
router.get("/:id/logs", verifyToken, authorizeRoles("PATIENT"), getMedicationLogs);

router.get(
  "/patient/:patientId",
  verifyToken,
  authorizeRoles("DOCTOR", "ADMIN"),
  getPatientMedicationReminders
);

module.exports = router;