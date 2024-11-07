import { Request, Response } from 'express';

import { Prisma } from '@prisma/client';
import * as TableService from '@services/table.service';
import { getHttpStatusCode } from '@utils/Utils';

/**
 * Controller to get all tables
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function getTables(req: Request, res: Response): Promise<void> {
  const id = (req.query.id || req.params.id) as string | undefined;
  const response = await TableService.getTables(id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to create a table
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function createTable(req: Request, res: Response): Promise<void> {
  const response = await TableService.createTable(
    req.body as Prisma.TableCreateInput,
  );

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to delete a table
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function deleteTable(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const response = await TableService.deleteTable(id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
