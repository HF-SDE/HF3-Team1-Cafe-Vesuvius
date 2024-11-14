import joi from "joi";
import { UuidSchema } from "./general.schemas";

export const getUserSchema = joi.object({
  id: UuidSchema,
  username: joi.string().alphanum(),
  email: joi.string().email(),
});
