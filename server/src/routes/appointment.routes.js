const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getMyPatientAppointments,
  getMyDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointment.controller");

const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

router.post("/", verifyToken, authorizeRoles("PATIENT"), createAppointment);
router.get("/mine/patient", verifyToken, authorizeRoles("PATIENT"), getMyPatientAppointments);
router.get("/mine/doctor", verifyToken, authorizeRoles("DOCTOR"), getMyDoctorAppointments);
router.patch("/:id/status", verifyToken, authorizeRoles("DOCTOR", "ADMIN"), updateAppointmentStatus);
router.delete("/:id", verifyToken, authorizeRoles("PATIENT", "ADMIN"), cancelAppointment);

module.exports = router;