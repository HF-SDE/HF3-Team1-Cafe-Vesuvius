import Joi from "./joi";
import { UuidSchema } from "./general.schemas";

export default Joi.object({
  number: Joi.number().positive().required(),
  capacity: Joi.number().positive().optional(),
});

export const search = Joi.object({
  id: UuidSchema.optional(),
  reservedNow: Joi.boolean(),
  number: Joi.number().positive(),
});
