import Joi from "./joi";
import { UuidSchema } from "./general.schemas";

interface OrderSchema {
  tableId: string;
  Order_Menus: [];
}

export default Joi.object({
  tableId: UuidSchema.required(),
  Order_Menus: Joi.array()
    .items(
      Joi.object({
        menuItemId: UuidSchema.required(),
        quantity: Joi.number().positive().optional(),
        note: Joi.string().optional(),
      })
    )
    .min(1)
    .required(),
});

export const where = Joi.object({
  id: UuidSchema.optional(),
  tableId: UuidSchema.optional(),
  status: Joi.string().valid("toPrepare", "completed", "deliver").optional(),
  createdAt: Joi.object({
    gte: Joi.date().optional(),
    lte: Joi.date().optional(),
  }).optional(),
  Order_Menus: Joi.object({
    some: Joi.object({
      status: Joi.string()
        .valid("toPrepare", "completed", "deliver")
        .optional(),
    }).optional(),
  }).optional(),
});

export const search = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .optional(),
  tableNumber: Joi.number().optional(),
  status: Joi.string().valid("toPrepare", "completed", "deliver").optional(),
  fromDay: Joi.alternatives()
    .try(Joi.date(), Joi.string().valid("today"))
    .custom((value) => (value === "today" ? new Date() : value))
    .optional(),
}).options({ allowUnknown: false });
