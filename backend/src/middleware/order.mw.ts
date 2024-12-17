import { NextFunction, Request, Response } from 'express';

import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { search } from '@schemas/order.schema';
import { order as orderConfig } from '@utils/configs';

interface OrderRequest extends Request {
  query: {
    tableNumber?: string;
    tableId?: string;

    status?: string;
  };

  config?: Prisma.OrderFindManyArgs;
}

/**
 * Middleware to transform the search query to a valid search
 * @param {OrderRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @returns {Promise<void>}
 */
export async function transformSearch(
  req: OrderRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const validatedSearch = search.validate(req.query);

  if (validatedSearch.error) {
    res.status(400).json({
      status: 'Failed',
      message: validatedSearch.error.message,
    });

    return;
  }

  const { value } = validatedSearch;

  delete req.query.tableNumber;
  delete req.query.status;

  if (value.tableNumber) {
    const table = await prisma.table.findFirst({
      where: { number: value.tableNumber },
    });

    if (!table) {
      res.status(404).json({ message: 'Table not found' }).end();

      return;
    }

    req.query.tableId = table.id;
  }

  if (value.status) {
    if (!req.config) req.config = { ...orderConfig };

    req.config.include = {
      ...req.config.include,
      Order_Menus: { where: { status: value.status } },
    };

    req.config.where = {
      ...req.config.where,
      ...req.query,
      Order_Menus: { some: { status: value.status } },
    };
  }

  next();
}
