const express = require("express");
const router = express.Router();

const {
  getMyDoctorProfile,
  updateMyDoctorProfile,
} = require("../controllers/doctor.controller");

const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

router.get("/me", verifyToken, authorizeRoles("DOCTOR"), getMyDoctorProfile);
router.put("/me", verifyToken, authorizeRoles("DOCTOR"), updateMyDoctorProfile);

module.exports = router;