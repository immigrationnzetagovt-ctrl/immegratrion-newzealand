const { z } = require("zod");
const { userDetailsSchema } = require("./userValidator");

const adminUserUpdateSchema = userDetailsSchema
  .safeExtend({
    identityVerified: z.boolean(),
  })
  .strict();

module.exports = adminUserUpdateSchema;
