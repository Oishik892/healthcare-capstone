const express = require("express");
const router = express.Router();

const {
  getMyPatientProfile,
  updateMyPatientProfile,
  getPatientById,
} = require("../controllers/patient.controller");

const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

router.get("/me", verifyToken, authorizeRoles("PATIENT"), getMyPatientProfile);
router.put("/me", verifyToken, authorizeRoles("PATIENT"), updateMyPatientProfile);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("DOCTOR", "ADMIN"),
  getPatientById
);

module.exports = router;