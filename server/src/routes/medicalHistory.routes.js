const express = require("express");
const router = express.Router();

const {
  getMyMedicalHistory,
  upsertMyMedicalHistory,
  getMedicalHistoryByPatientId,
} = require("../controllers/medicalHistory.controller");

const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

router.get("/me", verifyToken, authorizeRoles("PATIENT"), getMyMedicalHistory);
router.put("/me", verifyToken, authorizeRoles("PATIENT"), upsertMyMedicalHistory);

router.get(
  "/patient/:patientId",
  verifyToken,
  authorizeRoles("DOCTOR", "ADMIN"),
  getMedicalHistoryByPatientId
);

module.exports = router;