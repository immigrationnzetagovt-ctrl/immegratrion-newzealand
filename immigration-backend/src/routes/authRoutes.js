const express = require("express");
const authController = require("../controllers/authController");
const validateRegistration = require("../middleware/validateRegistration");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// router.post(”/register”, validateRegistration, authController.register);

router.post("/login", authController.login);
router.post(
"/verify-identity",
authenticate,
authController.verifyIdentity
);

module.exports = router;