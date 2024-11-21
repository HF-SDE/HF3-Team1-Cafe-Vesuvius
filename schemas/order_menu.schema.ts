import Joi from "./joi";

import { UuidSchema } from "./general.schemas";
import { Order_Menu } from "../backend/node_modules/.prisma/client";

const Order_MenuSchema = Joi.object<Order_Menu>({
  id: UuidSchema.required(),
  status: Joi.string()
    .valid("cook", "completed", "deliver")
    .required()
    .messages({
      "any.only": "({#key}) must one of {#valids}",
    }),
}).messages({
  "object.unknown": "({#child}) is nost allowed",
});

export default Order_MenuSchema;

export const Order_MenusSchema = Joi.array<Order_Menu[]>()
  .items(Order_MenuSchema)
  .min(1)
  .required();
