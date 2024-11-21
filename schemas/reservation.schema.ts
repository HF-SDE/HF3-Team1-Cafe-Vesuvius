import Joi from "./joi";

import { UuidSchema } from "./general.schemas";
import { Reservation } from "../backend/node_modules/.prisma/client";

const schema = Joi.object<Reservation>({
  reservationTime: Joi.date().required(),
  name: Joi.string().min(1).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  amount: Joi.number().positive().required(),
  tableIds: Joi.array().items(UuidSchema).min(1).required(),
});

export default schema.or("email", "phone").messages({
  "object.missing": "Either email or phone is required",
});

const keys = Object.keys(schema.describe().keys);
export const optional = schema.fork(keys, (schema) => schema.optional());
