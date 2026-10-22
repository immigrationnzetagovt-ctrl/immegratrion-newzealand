const express = require("express");
const adminController = require("../controllers/adminController");
const requireAdmin = require("../middleware/adminAuth");

const router = express.Router();

router.post("/login", adminController.login);
router.get("/users", requireAdmin, adminController.getUsers);

module.exports = router;
