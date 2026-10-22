const bcrypt = require("bcrypt");
const User = require("../models/User");
const userSchema = require("../validators/userValidator");
const countries = require("../utils/countries");

exports.createUser = async (req, res) => {
  try {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = result.data;

    const countryExists = countries.some(
      (country) => country.code === data.nationality.toUpperCase(),
    );

    if (!countryExists) {
      return res.status(400).json({
        message: "Invalid nationality country code",
      });
    }

    const email = data.email.toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const existingApplication = await User.findOne({
      applicationNumber: data.applicationNumber,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "Application number already exists",
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await User.create({
      familyName: data.familyName,
      email,
      passwordHash,
      passportNumber: data.passportNumber,
      documentNumber: data.documentNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      nationality: data.nationality.toUpperCase(),
      visaCategory: data.visaCategory,
      visaStartDate: data.visaStartDate,
      visaExpiryDate: data.visaExpiryDate,
      tnzClientNumber: data.tnzClientNumber,
      numberOfEntries: data.numberOfEntries,
      travelExpiryDate: data.travelExpiryDate,
      visaConditions: data.visaConditions,
      applicationNumber: data.applicationNumber,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        familyName: user.familyName,
        email: user.email,
        applicationNumber: user.applicationNumber,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A record with this unique value already exists",
      });
    }

    console.error("Create user failed:", error.message);

    return res.status(500).json({
      message: "Unable to create user",
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash -__v");

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User profile not found.",
      });
    }

    return res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to fetch profile.",
    });
  }
};

exports.getCountries = (req, res) => {
  return res.json(countries);
};
