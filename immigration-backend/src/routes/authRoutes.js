const express = require("express");
const authController = require("../controllers/authController");
const validateRegistration = require("../middleware/validateRegistration");

const router = express.Router();

// router.post(”/register”, validateRegistration, authController.register);

router.post("/login", authController.login);

module.exports = router;