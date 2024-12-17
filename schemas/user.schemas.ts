import joi from "joi";
import { EmailSchema, UuidSchema } from "./general.schemas";

export const getUserSchema = joi.object({
  id: UuidSchema,
  username: joi.string().alphanum(),
  email: EmailSchema,
});

export const createUserSchema = joi.object({
  name: joi.string().min(1).required(),
  username: joi.string().alphanum(),
  email: EmailSchema,
  password: joi.string().min(8).required(),
  permissions: joi.array().items(joi.string()).optional(),
});

export const updateUserSchema = joi.object({
  name: joi.string().min(1).optional(),
  username: joi.string().alphanum().optional(),
  email: EmailSchema.optional(),
  password: joi.string().min(8).optional(),
  permissions: joi.array().items(joi.string()).optional(),
});
