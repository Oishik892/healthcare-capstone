const express = require("express");
const router = express.Router();

const {
  uploadLabResult,
  getMyLabResults,
  getLabResultsByPatientId,
  getLabResultById,
} = require("../controllers/labResult.controller");

const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");
const { uploadLabResultFile } = require("../middleware/upload.middleware");

router.post(
  "/upload",
  verifyToken,
  authorizeRoles("DOCTOR", "ADMIN"),
  (req, res, next) => {
    uploadLabResultFile.single("reportFile")(req, res, (err) => {
      if (err) {
        err.statusCode = 400;
        return next(err);
      }
      next();
    });
  },
  uploadLabResult
);

router.get("/mine", verifyToken, authorizeRoles("PATIENT"), getMyLabResults);

router.get(
  "/patient/:patientId",
  verifyToken,
  authorizeRoles("DOCTOR", "ADMIN"),
  getLabResultsByPatientId
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("PATIENT", "DOCTOR", "ADMIN"),
  getLabResultById
);

module.exports = router;