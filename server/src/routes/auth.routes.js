const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/auth.controller");

const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMe);

// Optional RBAC test routes
router.get("/admin-only", verifyToken, authorizeRoles("ADMIN"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin",
  });
});

router.get(
  "/doctor-only",
  verifyToken,
  authorizeRoles("DOCTOR"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Doctor",
    });
  }
);

module.exports = router;