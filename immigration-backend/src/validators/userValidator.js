const { z } = require("zod");

const dateSchema = z.iso.date();

const userSchema = z
  .object({
    familyName: z.string().trim().min(1).max(100),

    email: z.string().trim().email().max(254),

    password: z.string().min(12).max(128),

    confirmPassword: z.string(),

    passportNumber: z
      .string()
      .trim()
      .regex(/^VV[A-Z0-9]+$/, "Passport number must start with VV"),

    documentNumber: z.string().trim().min(1).max(100),

    dateOfBirth: dateSchema,

    gender: z.enum([
      "Male",
      "Female",
      "Other",
      "Prefer not to say",
    ]),

    nationality: z.string().length(2),

    visaCategory: z.enum([
      "Visitor",
      "Student",
      "Work",
      "Business",
      "Transit",
    ]),

    visaStartDate: dateSchema,

    visaExpiryDate: dateSchema,

    tnzClientNumber: z.string().trim().min(1).max(100),

    numberOfEntries: z.enum(["Single", "Multiple"]),

    travelExpiryDate: dateSchema,

    applicationNumber: z.string().trim().min(1).max(100),

    visaConditions: z.string().max(10000).optional().default(""),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => new Date(data.dateOfBirth) < new Date(), {
    message: "Date of birth must be in the past",
    path: ["dateOfBirth"],
  })
  .refine((data) => data.visaExpiryDate > data.visaStartDate, {
    message: "Visa expiry must be after the start date",
    path: ["visaExpiryDate"],
  });

module.exports = userSchema;