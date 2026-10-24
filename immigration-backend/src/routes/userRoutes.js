const express = require("express");
const router = express.Router();

const {
  createUser,
  getCountries,
  getMyProfile,
} = require("../controllers/userController");

const { authenticate } = require("../middleware/authMiddleware");

// Keep your existing registration endpoint.
router.post("/", createUser);

// Keep your existing countries endpoint.
router.get("/countries", getCountries);

// Logged-in user's profile.
router.get("/me", authenticate, getMyProfile);

module.exports = router;