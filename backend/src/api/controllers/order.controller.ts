import { Request, Response } from 'express';

import { Order_Menu } from '@prisma/client';
import { Order_MenusSchema } from '@schemas/order_menu.schema';
import * as OrderService from '@services/order.service';
import { getHttpStatusCode } from '@utils/Utils';

export interface ReqBody extends Request {
  tableId: string;
  items: Order_Menu[];
}

/**
 * Controller to create an order
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export async function createOrder(req: Request, res: Response): Promise<void> {
  const data = req.body as ReqBody;

  const response = await OrderService.createOrder({
    tableId: data.tableId,
    Order_Menus: data.items,
  });

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

interface OrderStatusRequest extends Request {
  body: {
    items?: Order_Menu[];
  };
}

/**
 * Controller to validate the order status
 * @param {OrderStatusRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export async function updateOrderStatus(
  req: OrderStatusRequest,
  res: Response,
): Promise<void> {
  let items = req.body.items || [];
  const orderId = req.params.id;

  const validated = Order_MenusSchema.validate(items);

  if (validated.error) {
    res.status(400).json({
      status: 'Failed',
      message: validated.error.message,
    });

    return;
  }

  items = validated.value;

  const response = await OrderService.updateStatus(orderId, items);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
