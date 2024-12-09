import { Request, Response } from 'express';

import { APIResponse } from '@api-types/general.types';
import {
  StockRequestBody,
  StockRequestQuery,
  StockResult,
} from '@api-types/stock.types';
import { Prisma } from '@prisma/client';
import * as StockService from '@services/stock.service';
import { getHttpStatusCode } from '@utils/Utils';

/**
 * Controller to get stock items
 * @param {Request<unknown, APIResponse<StockResult>, unknown, StockRequestQuery>} req - The request object
 * @param {Response<APIResponse<StockResult>>} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function getStock(
  req: Request<unknown, APIResponse<StockResult>, unknown, StockRequestQuery>,
  res: Response<APIResponse<StockResult>>,
): Promise<void> {
  const id = req.query.id;
  const response = await StockService.get(id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to create a stock item
 * @param {Request<unknown, APIResponse, Prisma.RawMaterialCreateWithoutRawMaterial_MenuItemsInput>} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function createStock(
  req: Request<
    unknown,
    APIResponse,
    Prisma.RawMaterialCreateWithoutRawMaterial_MenuItemsInput
  >,
  res: Response<APIResponse>,
): Promise<void> {
  const data = req.body;

  const response = await StockService.create(data);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to update a stock item
 * @param {Request<unknown, APIResponse, StockRequestBody>} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function updateStock(
  req: Request<unknown, APIResponse, StockRequestBody>,
  res: Response<APIResponse>,
): Promise<void> {
  const data = req.body;
  const response = await StockService.update(data.items);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
