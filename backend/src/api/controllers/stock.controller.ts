import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { APIResponse } from '@api-types/general.types';
import {
  StockRequestBody,
  StockRequestQuery,
  StockResult,
} from '@api-types/stock.types';
import { Prisma } from '@prisma/client';
import * as StockService from '@services/stock.service';
import { getHttpStatusCode } from '@utils/Utils';
import qs from 'qs';

/**
 * Controller to get stock items
 * @param {Request<ParamsDictionary, APIResponse<StockResult>, qs.ParsedQs, StockRequestQuery>} req - The request object
 * @param {Response<APIResponse<StockResult>>} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function getStock(
  req: Request<
    ParamsDictionary,
    APIResponse<StockResult>,
    qs.ParsedQs,
    StockRequestQuery
  >,
  res: Response<APIResponse<StockResult>>,
): Promise<void> {
  const id = req.query.id;
  const response = await StockService.get(id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

// eslint-disable-next-line no-secrets/no-secrets
/**
 * Controller to create a stock item
 * @param {Request<ParamsDictionary, APIResponse, Prisma.RawMaterialCreateWithoutRawMaterial_MenuItemsInput>} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function createStock(
  req: Request<
    ParamsDictionary,
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
 * @param {Request<ParamsDictionary, APIResponse, StockRequestBody>} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function updateStock(
  req: Request<ParamsDictionary, APIResponse, StockRequestBody>,
  res: Response<APIResponse>,
): Promise<void> {
  const data = req.body;
  const response = await StockService.update(data.items);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
