import Joi from "joi";

// Define Joi schema for user validation
export const UserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.min": "Username must be at least 3 characters.",
    "string.max": "Username must not exceed 30 characters.",
  }),
  name: Joi.string().min(3).max(30).required().messages({
    "string.min": "Name must be at least 3 characters.",
    "string.max": "Name must not exceed 50 characters.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Invalid email address.",
    }),
  initials: Joi.string().max(4).required().messages({
    "string.max": "Initials must not exceed 4 characters.",
  }),
  password: Joi.string().optional(),

  UserPermissions: Joi.array().optional(),
  active: Joi.boolean().required(),
  id: Joi.optional(),
});
