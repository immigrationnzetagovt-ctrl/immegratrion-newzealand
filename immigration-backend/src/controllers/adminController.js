const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
