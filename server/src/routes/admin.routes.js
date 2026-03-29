const express = require("express");
const router = express.Router();

const { getAllUsers } = require("../controllers/admin.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

router.get("/users", verifyToken, authorizeRoles("ADMIN"), getAllUsers);

module.exports = router;