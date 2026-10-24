const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  let decoded;
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }
    const token = authHeader.split(" ")[1];
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }

  if (typeof decoded.userId !== "string") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }

  try {
    const user = await User.findById(decoded.userId).select("+passwordChangedAt");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Applicant record not found.",
      });
    }
    if (
      user.passwordChangedAt &&
      decoded.passwordChangedAt !== user.passwordChangedAt.getTime()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    req.userId = decoded.userId;
    return next();
  } catch (error) {
    console.error("Authentication check failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to authenticate this request.",
    });
  }
};
