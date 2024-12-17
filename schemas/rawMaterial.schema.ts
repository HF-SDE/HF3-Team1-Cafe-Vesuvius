import Joi from "joi";
import { UuidSchema } from "./general.schemas";

export const StockCreateSchema = Joi.object({
  name: Joi.string().min(1).required(),
  quantity: Joi.number().positive().allow(0).required(),
  unit: Joi.string().required(),
});

export const create = StockCreateSchema;

export const StockUpdateSchema = Joi.array()
  .items(
    Joi.object({
      id: UuidSchema.required(),
      quantity: Joi.number().positive().allow(0),
      unit: Joi.string(),
      name: Joi.string().min(1),
    }).or("quantity", "unit", "name")
  )
  .min(1)
  .unique("id")
  .required();

export const where = Joi.object({
  id: UuidSchema.optional(),
  name: Joi.string().min(1).optional(),
  quantity: Joi.number().positive().optional(),
  unit: Joi.string().optional(),
});
