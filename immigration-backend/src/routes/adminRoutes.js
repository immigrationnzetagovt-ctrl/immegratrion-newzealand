const express = require("express");
const adminController = require("../controllers/adminController");
const requireAdmin = require("../middleware/adminAuth");

const router = express.Router();

router.post("/login", adminController.login);
router.get("/users", requireAdmin, adminController.getUsers);
router.put("/users/:id", requireAdmin, adminController.updateUser);
router.delete("/users/:id", requireAdmin, adminController.deleteUser);
router.patch(
  "/users/:id/reset-password",
  requireAdmin,
  adminController.resetUserPassword
);

module.exports = router;
