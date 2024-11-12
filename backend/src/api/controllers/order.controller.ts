import { Request, Response } from 'express';

import { Prisma } from '@prisma/client';
import * as OrderService from '@services/order.service';
import { getHttpStatusCode } from '@utils/Utils';

/**
 * Controller to create a order
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function create(req: Request, res: Response): Promise<void> {
  const data = req.body as Prisma.OrderCreateInput;

  const response = await OrderService.create(data);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
