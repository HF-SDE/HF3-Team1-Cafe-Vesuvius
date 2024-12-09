import { Request, Response } from 'express';

import { Order_MenusSchema } from '@schemas/order_menu.schema';
import * as OrderService from '@services/order.service';
import { getHttpStatusCode } from '@utils/Utils';
import { APIResponse } from '@api-types/general.types';
import { CreateOrderReqBody, OrderRequestBody, OrderRequestParams } from '@api-types/order.types';

/**
 * Controller to create an order
 * @param {Request<unknown, APIResponse, CreateOrderReqBody>} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @returns {Promise<void>}
 */
export async function createOrder(req: Request<unknown, APIResponse, CreateOrderReqBody>, res: Response<APIResponse>): Promise<void> {
  const data = req.body;

  const response = await OrderService.createOrder({
    tableId: data.tableId,
    Order_Menus: data.items,
  });

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to validate the order status
 * @param {Request<OrderRequestParams, unknown, OrderRequestBody>} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export async function updateOrderStatus(
  req: Request<OrderRequestParams, unknown, OrderRequestBody>,
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
