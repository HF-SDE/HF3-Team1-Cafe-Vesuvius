import Joi from "./joi";
import { UuidSchema } from "./general.schemas";

export const create = Joi.object({
  number: Joi.number().positive().required(),
  capacity: Joi.number().positive().optional(),
});

export const search = Joi.object({
  id: UuidSchema.optional(),
  reservedNow: Joi.boolean(),
  number: Joi.number().positive(),
});

export const where = Joi.object({
  id: UuidSchema.optional(),
  number: Joi.number().positive().optional(),
  capacity: Joi.number().positive().optional(),
  Reservations: Joi.object({
    some: Joi.object({
      reservationTime: Joi.object({
        gt: Joi.date().optional(),
        lt: Joi.date().optional(),
      }).optional(),
    }).optional(),
  }).optional(),
});
