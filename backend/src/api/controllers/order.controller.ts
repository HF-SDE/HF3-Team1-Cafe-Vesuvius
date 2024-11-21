import { NextFunction, Request, Response } from 'express';

import prisma from '@prisma-instance';
import { Order_Menu } from '@prisma/client';
import { Order_MenusSchema } from '@schemas/order_menu.schema';
import * as OrderService from '@services/order.service';
import { getHttpStatusCode } from '@utils/Utils';

interface OrderRequest extends Request {
  body: {
    items?: Order_Menu[];
    Order_Menus: {
      createMany: {
        data: Order_Menu[];
      };
    };
  };
}

/**
 * Controller to transform the menus array
 * @async
 * @param {OrderRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>} The response object
 */
export async function transformMenus(
  req: OrderRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { items } = req.body;
  delete req.body.items;

  if (!items) {
    res.status(400).json({
      status: 'Failed',
      message: 'No items provided',
    });

    return;
  }

  for (const item of items) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: item.menuItemId },
    });

    if (!menuItem) {
      res.status(400).json({
        status: 'Failed',
        message: 'Menu item not found: ' + item.menuItemId,
      });

      return;
    }

    item.menuItemPrice = menuItem.price;
  }

  req.body.Order_Menus = { createMany: { data: items } };

  next();
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

  const validated = Order_MenusSchema.validate(items);

  if (validated.error) {
    res.status(400).json({
      status: 'Failed',
      message: validated.error.message,
    });

    return;
  }

  items = validated.value;

  const response = await OrderService.updateStatus(items);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
