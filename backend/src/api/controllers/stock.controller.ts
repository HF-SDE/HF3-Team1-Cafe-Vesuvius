import { Request, Response } from 'express';

import * as StockService from '@services/stock.service';
import { getHttpStatusCode } from '@utils/Utils';

/**
 * Controller to get stock items
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {*} The response object
 */
export async function getStock(req: Request, res: Response) {
  const id = req.params.id;
  const response = await StockService.getStock(id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
