import joi from "joi";
import { EmailSchema, UuidSchema } from "./general.schemas";

export const getUserSchema = joi.object({
  id: UuidSchema,
  username: joi.string().alphanum(),
  email: EmailSchema
});
