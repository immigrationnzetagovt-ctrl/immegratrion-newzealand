const { z } = require("zod");

const dateSchema = z.iso.date();

const userFields = {
    familyName: z.string().trim().min(1).max(100),

    email: z.string().trim().email().max(254),

    passportNumber: z.string().trim().min(1).max(100),

    documentNumber: z.string().trim().min(1).max(100),

    dateOfBirth: dateSchema,

    gender: z.enum([
      "Male",
      "Female",
      "Other",
      "Prefer not to say",
    ]),

    nationality: z.string().trim().length(2),

    visaCategory: z.enum([
      "Visitor",
      "Student",
      "Work",
      "Business",
      "Transit",
    ]),

    visaIssueDate: dateSchema,

    visaStartDate: dateSchema,

    // No comparison with visaStartDate.
    visaExpiryDate: dateSchema,

    firstEntryDate: dateSchema,

    tnzClientNumber: z.string().trim().min(1).max(100),

    numberOfEntries: z.enum(["Single", "Multiple"]),

    travelExpiryDate: dateSchema,

    applicationNumber: z.string().trim().min(1).max(100),

    visaConditions: z.string().max(10000).optional().default(""),
};

const dateOfBirthIsInPast = (data) => new Date(data.dateOfBirth) < new Date();
const dateOfBirthError = {
    message: "Date of birth must be in the past",
    path: ["dateOfBirth"],
};

const userDetailsSchema = z
  .object(userFields)
  .refine(dateOfBirthIsInPast, dateOfBirthError);

const userSchema = z
  .object({
    ...userFields,
    // Any non-empty password; no format or length restriction.
    password: z.string().min(1),
  })
  .refine(dateOfBirthIsInPast, dateOfBirthError);

module.exports = { userSchema, userDetailsSchema };