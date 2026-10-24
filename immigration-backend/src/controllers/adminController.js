const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const countries = require("../utils/countries");
const adminUserUpdateSchema = require("../validators/adminUserUpdateValidator");
const { z } = require("zod");

exports.login = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!process.env.ADMIN_ID || !process.env.ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: "Admin credentials are not configured on the server.",
      });
    }

    if (
      adminId !== process.env.ADMIN_ID ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin ID or password.",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        type: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash -__v")
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch users.",
    });
  }
};

const isValidUserId = (id) => /^[a-f\d]{24}$/i.test(id);

const validateUserId = (req, res) => {
  if (!isValidUserId(req.params.id)) {
    res.status(404).json({
      success: false,
      message: "Applicant not found.",
    });
    return false;
  }

  return true;
};

exports.updateUser = async (req, res) => {
  if (!validateUserId(req, res)) return;

  const result = adminUserUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const data = result.data;
  const nationality = data.nationality.toUpperCase();
  if (!countries.some((country) => country.code === nationality)) {
    return res.status(400).json({
      success: false,
      message: "Invalid nationality country code",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...data,
        email: data.email.toLowerCase(),
        nationality,
      },
      { new: true, runValidators: true }
    )
      .select("-passwordHash -__v")
      .lean();

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applicant updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A record with this email or application number already exists.",
      });
    }

    console.error("Admin update user error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update applicant.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  if (!validateUserId(req, res)) return;

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).select("_id");
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applicant deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete applicant.",
    });
  }
};

exports.resetUserPassword = async (req, res) => {
  if (!validateUserId(req, res)) return;

  const passwordResult = z
    .object({ newPassword: z.string().min(1) })
    .strict()
    .safeParse(req.body);

  if (!passwordResult.success) {
    return res.status(400).json({
      success: false,
      message: "A non-empty new password is required.",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(passwordResult.data.newPassword, 12);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { passwordHash, passwordChangedAt: new Date() } },
      { new: true }
    )
      .select("_id")
      .lean();

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applicant password reset successfully.",
    });
  } catch (error) {
    console.error("Admin reset user password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to reset applicant password.",
    });
  }
};
