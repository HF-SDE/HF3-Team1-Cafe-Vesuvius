import Joi from "joi";
import { UuidSchema } from "./general.schemas";

export const StockCreateSchema = Joi.object({
  name: Joi.string().min(1).required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().required(),
});

export const StockUpdateSchema = Joi.array()
  .items(
    Joi.object({
      id: UuidSchema.required(),
      quantity: Joi.number().positive(),
      unit: Joi.string(),
    }).or("quantity", "unit")
  )
  .min(1)
  .unique("id")
  .required();