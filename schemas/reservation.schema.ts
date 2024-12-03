import Joi from "./joi";

import { UuidSchema } from "./general.schemas";
import { Reservation, Prisma } from "../backend/node_modules/.prisma/client";

const schema = Joi.object<Prisma.ReservationCreateInput>({
  reservationTime: Joi.date()
    .greater(new Date().setHours(0, 0, 0, 0))
    .message("{#label} should be in the future")
    .required(),
  name: Joi.string().min(1).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  amount: Joi.number().positive().required(),
  Tables: Joi.object({
    connect: Joi.array()
      .items(Joi.object({ id: UuidSchema.required() }))
      .optional(),
  }).required(),
});

export default schema.or("email", "phone").messages({
  "object.missing": "Either email or phone is required",
});

const keys = Object.keys(schema.describe().keys);
export const optional = schema.fork(keys, (schema) => schema.optional());

export const where = Joi.object<Prisma.ReservationWhereInput>({
  id: UuidSchema.optional(),
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  reservationTime: Joi.alternatives()
    .try(
      Joi.date(),
      Joi.object().pattern(
        Joi.string().valid("lte", "gte", "lt", "gt"),
        Joi.date().required()
      )
    )
    .optional(),
}).options({ allowUnknown: false });
