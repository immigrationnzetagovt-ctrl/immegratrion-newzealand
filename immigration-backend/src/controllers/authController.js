const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash +passwordChangedAt");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        passwordChangedAt: user.passwordChangedAt?.getTime() ?? null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: user.identityVerified
        ? "Login successful."
        : "Please verify your identity to continue.",
      token,
      user: {
        id: user._id,
        email: user.email,
        familyName: user.familyName,
        identityVerified: user.identityVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
};

exports.verifyIdentity = async (req, res) => {
  try {
    const {
      familyName,
      passportNumber,
      documentNumber,
      dateOfBirth,
      gender,
      visaStartDate,
    } = req.body;

    if (
      typeof familyName !== "string" ||
      typeof passportNumber !== "string" ||
      typeof documentNumber !== "string" ||
      typeof dateOfBirth !== "string" ||
      typeof gender !== "string" ||
      typeof visaStartDate !== "string" ||
      !familyName.trim() ||
      !passportNumber.trim() ||
      !documentNumber.trim() ||
      !dateOfBirth.trim() ||
      !gender.trim() ||
      !visaStartDate.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All identity fields are required.",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Applicant record not found.",
      });
    }

    const normalize = (value) =>
      String(value).trim().toLowerCase();

    const parseDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
      }

      const date = new Date(`${value}T00:00:00.000Z`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== value
      ) {
        return null;
      }

      return value;
    };

    const submittedDOB = parseDate(dateOfBirth);
    const submittedVisaStart = parseDate(visaStartDate);

    if (!submittedDOB || !submittedVisaStart) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid dates.",
      });
    }

    const storedDOB = user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
      : null;

    const storedVisaStart = user.visaStartDate
      ? new Date(user.visaStartDate).toISOString().slice(0, 10)
      : null;

    const matches =
      normalize(user.familyName) === normalize(familyName) &&
      normalize(user.passportNumber) === normalize(passportNumber) &&
      normalize(user.documentNumber) === normalize(documentNumber) &&
      storedDOB === submittedDOB &&
      normalize(user.gender) === normalize(gender) &&
      storedVisaStart === submittedVisaStart;

    if (!matches) {
      return res.status(400).json({
        success: true,
        verified: false,
        message: "The identity details could not be verified.",
      });
    }

    user.identityVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      verified: true,
      message: "Identity verification successful.",
    });
  } catch (error) {
    console.error("Identity verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify identity at this time.",
    });
  }
};