import { OrderModel } from "@/models/OrderModel";

export default function getTotal(order: OrderModel): number;
export default function getTotal(OrderMenus: OrderModel["Order_Menus"]): number;

export default function getTotal(input: any): number {
  let orderMenus: OrderModel["Order_Menus"] = [];

  if (input instanceof Array) {
    orderMenus = input;
  } else {
    orderMenus = input.Order_Menus;
  }

  if (!orderMenus) return 0;

  return orderMenus.reduce((acc, i) => acc + i.quantity * i.Menu.price, 0);
}
