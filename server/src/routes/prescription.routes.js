const express = require("express");
const router = express.Router();

const {
  createPrescription,
  getMyPatientPrescriptions,
  getMyDoctorPrescriptions,
  getPrescriptionsByPatientId,
  getPrescriptionById,
} = require("../controllers/prescription.controller");

const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

router.post("/", verifyToken, authorizeRoles("DOCTOR"), createPrescription);
router.get("/mine/patient", verifyToken, authorizeRoles("PATIENT"), getMyPatientPrescriptions);
router.get("/mine/doctor", verifyToken, authorizeRoles("DOCTOR"), getMyDoctorPrescriptions);
router.get("/patient/:patientId", verifyToken, authorizeRoles("DOCTOR", "ADMIN"), getPrescriptionsByPatientId);
router.get("/:id", verifyToken, authorizeRoles("PATIENT", "DOCTOR", "ADMIN"), getPrescriptionById);

module.exports = router;