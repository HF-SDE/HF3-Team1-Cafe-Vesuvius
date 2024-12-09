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
        quantity: Joi.number().positive().optional(),
        note: Joi.string().optional(),
      })
    )
    .min(1)
    .required(),
});

interface AdditionalSearchQuery {
  tableNumber?: number;
  status?: string;
}

export const search = Joi.object<
  Prisma.OrderWhereInput & AdditionalSearchQuery
>({
  id: UuidSchema.optional(),
  tableNumber: Joi.number().optional(),
  status: Joi.string().valid("toPrepare", "completed", "deliver").optional(),
}).options({ allowUnknown: false });
