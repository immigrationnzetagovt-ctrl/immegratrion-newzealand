const { z } = require("zod");

const registrationSchema = z
  .object({
    familyName: z.string().trim().min(1).max(100),

    email: z.string().trim().email().max(254),

    password: z.string().min(1),

    confirmPassword: z.string(),

    dateOfBirth: z.iso.date(),

    gender: z.enum([
      "Male",
      "Female",
      "Other",
      "Prefer not to say",
    ]),

    nationality: z.string().trim().min(2).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => new Date(data.dateOfBirth) < new Date(),
    {
      message: "Date of birth must be in the past",
      path: ["dateOfBirth"],
    }
  );

module.exports = { registrationSchema };