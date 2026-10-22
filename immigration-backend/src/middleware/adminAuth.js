const jwt = require("jsonwebtoken");

const requireAdmin = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin login required.",
      });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin" || decoded.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin privileges required.",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token. Please log in again.",
    });
  }
};

module.exports = requireAdmin;
