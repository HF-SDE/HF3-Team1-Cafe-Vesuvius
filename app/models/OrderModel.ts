import {
  Order,
  Order_Menu,
  Table,
  MenuItem,
} from "../../backend/node_modules/.prisma/client";

type defaultOmit = "createdAt" | "updatedAt";

interface OrderMenu extends Order_Menu {
  Menu: Omit<MenuItem, defaultOmit>;
}

export interface OrderModel extends Omit<Order, "tableId"> {
  Order_Menus: Omit<OrderMenu, "menuItemId" | "orderId">[];
  Table: Table;
}
