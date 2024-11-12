import { Request, Response } from 'express';

import { Prisma } from '@prisma/client';
import * as DefaultService from '@services/default.service';
import { getHttpStatusCode } from '@utils/Utils';

type prismaModels = Uncapitalize<Prisma.ModelName>;

/**
 * Controller to get all
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function getAll(req: Request, res: Response): Promise<void> {
  const model = req.baseUrl.replace('/', '') as prismaModels;
  const id = (req.query.id || req.params.id) as string | undefined;

  const response = await DefaultService.getAll(model, id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to create a record
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function create(req: Request, res: Response): Promise<void> {
  const model = req.baseUrl.replace('/', '') as prismaModels;

  const response = await DefaultService.create(model, req.body);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to update a record
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function update(req: Request, res: Response): Promise<void> {
  const model = req.baseUrl.replace('/', '') as prismaModels;
  const { id } = req.params;

  const response = await DefaultService.update(model, id, req.body);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to delete a record
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function deleteRecord(req: Request, res: Response): Promise<void> {
  const model = req.baseUrl.replace('/', '') as prismaModels;
  const { id } = req.params;

  const response = await DefaultService.deleteRecord(model, id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
