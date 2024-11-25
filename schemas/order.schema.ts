import Joi from "./joi";
import { Prisma, Order_Menu } from "../backend/node_modules/.prisma/client";
import { UuidSchema } from "./general.schemas";

interface OrderSchema {
  tableId: string;
  Order_Menus: Order_Menu[];
}

export default Joi.object<OrderSchema>({
  tableId: UuidSchema.required(),
  Order_Menus: Joi.array<Order_Menu[]>()
    .items(
      Joi.object<Order_Menu>({
        menuItemId: UuidSchema.required(),
        quantity: Joi.number().positive().required(),
        note: Joi.string().optional(),
      })
    )
    .min(1)
    .required(),
});
