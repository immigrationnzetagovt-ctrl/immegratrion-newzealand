const { registrationSchema } = require("../validators/registrationSchema");

function validateRegistration(req, res, next) {
  const result = registrationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid registration data",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.validatedBody = result.data;
  next();
}

module.exports = validateRegistration;