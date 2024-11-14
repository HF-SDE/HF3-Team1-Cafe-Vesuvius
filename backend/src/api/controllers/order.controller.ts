import { NextFunction, Request, Response } from 'express';

import prisma from '@prisma-instance';
import { Order_Menu } from '@prisma/client';

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
