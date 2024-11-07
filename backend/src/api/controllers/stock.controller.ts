import { Request, Response } from 'express';

import { StockUpdate } from '@api-types/stock.types';
import { Prisma } from '@prisma/client';
import * as StockService from '@services/stock.service';
import { getHttpStatusCode } from '@utils/Utils';

/**
 * Controller to get stock items
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function getStock(req: Request, res: Response): Promise<void> {
  const id = req.query.id as string | undefined;
  const response = await StockService.get(id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to create a stock item
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function createStock(req: Request, res: Response): Promise<void> {
  const data = req.body as Prisma.RawMaterialCreateInput;

  const response = await StockService.create(data);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to update a stock item
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function updateStock(req: Request, res: Response): Promise<void> {
  const data = req.body as StockUpdate;
  const response = await StockService.update(data.items);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
