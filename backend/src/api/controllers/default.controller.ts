import { Request, Response } from 'express';

import { ExpressFunction, Status } from '@api-types/general.types';
import { prismaModels } from '@prisma-instance';
import { UuidSchema } from '@schemas/general.schemas';
import * as DefaultService from '@services/default.service';
import { getHttpStatusCode } from '@utils/Utils';
import * as configWithoutType from '@utils/configs';

// eslint-disable-next-line jsdoc/require-jsdoc
function getModel(req: Request): prismaModels {
  return req.baseUrl.replace('/', '') as prismaModels;
}

type Config = Record<prismaModels, Record<string, unknown>>;
const config: Config = configWithoutType as Config;

/**
 * Controller to get all
 * @param {prismaModels} model - The Prisma model to get the records from.
 * @returns {ExpressFunction} The response object
 */
export function getAll(model?: prismaModels): ExpressFunction {
  return async (req, res) => {
    if (!model) model = getModel(req);

    req.query.id ??= req.params.id;

    const { error } = UuidSchema.validate(req.query.id);

    if (error) {
      res
        .status(400)
        .json({ status: Status.InvalidDetails, message: error.message })
        .end();

      return;
    }

    const modelConfig = req.config || { ...config[model], where: req.query };

    const response = await DefaultService.getAll(model, modelConfig);

    res.status(getHttpStatusCode(response.status)).json(response).end();
  };
}

/**
 * Controller to create a record
 * @param {prismaModels} model - The Prisma model to create the record with.
 * @returns {ExpressFunction} The response object
 */
export function create(model?: prismaModels): ExpressFunction {
  return async (req: Request, res: Response): Promise<void> => {
    const response = await DefaultService.create(
      model ?? getModel(req),
      req.body,
    );

    res.status(getHttpStatusCode(response.status)).json(response).end();
  };
}

/**
 * Controller to update a record
 * @param {prismaModels} model - The Prisma model to update the record in.
 * @returns {ExpressFunction} The response object
 */
export function update(model?: prismaModels): ExpressFunction {
  return async (req, res) => {
    const id = (req.params.id || req.query.id) as string;

    if (!model) model = getModel(req);

    const response = await DefaultService.update(model, id, req.body);

    res.status(getHttpStatusCode(response.status)).json(response).end();
  };
}

/**
 * Controller to delete a record
 * @param {prismaModels} model - The Prisma model to delete the record from.
 * @returns {ExpressFunction} The response object
 */
export function deleteRecord(model?: prismaModels): ExpressFunction {
  return async (req, res) => {
    const id = (req.params.id || req.query.id) as string;

    if (!model) model = getModel(req);

    const response = await DefaultService.deleteRecord(model, id);

    res.status(getHttpStatusCode(response.status)).json(response).end();
  };
}
