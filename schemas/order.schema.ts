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
});

export const search = Joi.object({
  id: UuidSchema.optional(),
  tableNumber: Joi.number().optional(),
  status: Joi.string().valid("toPrepare", "completed", "deliver").optional(),
}).options({ allowUnknown: false });
