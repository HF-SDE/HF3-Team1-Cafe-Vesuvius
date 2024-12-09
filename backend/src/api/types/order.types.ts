import { Order_Menu } from '@prisma/client';

export interface OrderRequestBody {
  items?: Order_Menu[];
}

export interface OrderRequestParams {
  id: string;
}

export interface CreateOrderReqBody {
  tableId: string;
  items: Order_Menu[];
}
