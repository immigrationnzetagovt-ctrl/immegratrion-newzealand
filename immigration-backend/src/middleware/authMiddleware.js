const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

exports.requireIdentityVerification = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const user = await User.findById(req.userId).select("identityVerified");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Applicant record not found.",
      });
    }
    if (!user.identityVerified) {
      return res.status(403).json({
        success: false,
        code: "IDENTITY_VERIFICATION_REQUIRED",
        message: "Please verify your identity first.",
      });
    }
    next();
  } catch (error) {
    console.error("Identity access check failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to authorize this request.",
    });
  }
};
