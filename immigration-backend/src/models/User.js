const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    familyName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    passportNumber: {
      type: String,
      required: true,
      match: /^VV[A-Z0-9]+$/,
    },

    documentNumber: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      required: true,
    },

    nationality: {
      type: String,
      required: true,
    },

    visaCategory: {
      type: String,
      enum: ["Visitor", "Student", "Work", "Business", "Transit"],
      required: true,
    },

    visaStartDate: {
      type: Date,
      required: true,
    },

    visaExpiryDate: {
      type: Date,
      required: true,
    },

    tnzClientNumber: {
      type: String,
      required: true,
    },

    numberOfEntries: {
      type: String,
      enum: ["Single", "Multiple"],
      required: true,
    },

    travelExpiryDate: {
      type: Date,
      required: true,
    },

    applicationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    visaConditions: {
    type: String,
    default: "",
    trim: true,
  },
  identityVerified: {
  type: Boolean,
  default: false,
},
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

module.exports = mongoose.model("User", userSchema);