/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Joi from 'joi';

import { APIResponse, Status } from '@api-types/general.types';
import prisma, { errorResponse, prismaModels } from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { capitalize, getSchema } from '@utils/Utils';

type Result = any;

/**
 * Service to get all records from a collection
 * @async
 * @param {prismaModels} prismaModel - The Prisma model to get the records from.
 * @param {Record<string, unknown>} config - The parameters to filter the records by.
 * @returns {Promise<APIResponse<Result>>} A promise that resolves to an object containing the data, status, and message.
 */
export async function getAll(
  prismaModel: prismaModels,
  config: Record<string, unknown> = {},
): Promise<APIResponse<Result>> {
  const whereSchema = getSchema(prismaModel, { type: 'where' });

  if (whereSchema) {
    const validatedWhere = whereSchema.validate(config.where);

    if (validatedWhere.error) {
      return {
        status: Status.InvalidDetails,
        message: validatedWhere.error.message,
      };
    }

    config.where = validatedWhere.value;
  }

  const prismaType = prisma[prismaModel] as any;

  if (!prismaType) {
    return {
      status: Status.Failed,
      message: `Database collection not found`,
    };
  }

  const results = await prismaType.findMany(config);

  return {
    data: results,
    status: Status.Found,
    message: `${capitalize(prismaModel)}(s) found`,
  };
}

/**
 * Service to create a record
 * @async
 * @param {prismaModels} prismaModel - The Prisma model to create the record with.
 * @param {any} data - The data to create a record with.
 * @param {Joi.ObjectSchema} schema - The schema to validate the data against.
 * @returns {Promise<APIResponse<Result>>} A promise that resolves to an object containing the record data, status, and message.
 */
export async function create(
  prismaModel: prismaModels,
  data: unknown,
  schema: Joi.ObjectSchema | undefined = getSchema(prismaModel),
): Promise<APIResponse<Result>> {
  try {
    const prismaType = prisma[prismaModel] as any;

    if (schema) {
      const { value, error } = schema.validate(data);

      if (error) {
        return {
          status: Status.InvalidDetails,
          message: error.message,
        };
      }

      data = value;
    }

    await prismaType.create({ data });

    return {
      status: Status.Created,
      message: `Created new ${prismaModel}`,
    };
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    return errorResponse(prismaError, prismaModel, 'CreationFailed');
  }
}

/**
 * Service to update a record
 * @async
 * @param {prismaModels} prismaModel - The Prisma model to update the record from.
 * @param {string} id - The id of the record to update.
 * @param {any} data - The data to update the record with.
 * @param {Joi.ObjectSchema} schema - The schema to validate the data against.
 * @returns {Promise<APIResponse<Result>>} A promise that resolves to an object containing the record data, status, and message.
 */
export async function update(
  prismaModel: prismaModels,
  id: string,
  data: unknown,
  schema: Joi.ObjectSchema | undefined = getSchema(prismaModel, {
    type: 'optional',
  }),
): Promise<APIResponse<Result>> {
  const prismaType = prisma[prismaModel] as any;

  try {
    if (schema) {
      const { value, error } = schema.validate(data);

      if (error) {
        return {
          status: Status.InvalidDetails,
          message: error.message,
        };
      }

      data = value;
    }
    await prismaType.update({ where: { id }, data });

    return {
      status: Status.Updated,
      message: `Updated ${prismaModel}`,
    };
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    return errorResponse(prismaError, prismaModel, 'UpdateFailed');
  }
}

/**
 * Service to delete a record
 * @async
 * @param {prismaModels} prismaModel - The Prisma model to delete the record from.
 * @param {string} id - The id of the record to delete.
 * @returns {Promise<APIResponse<Result>>} A promise that resolves to an object containing the record data, status, and message.
 */
export async function deleteRecord(
  prismaModel: prismaModels,
  id: string,
): Promise<APIResponse<Result>> {
  const prismaType = prisma[prismaModel] as any;

  try {
    await prismaType.delete({ where: { id } });

    return {
      status: Status.Deleted,
      message: `Deleted ${prismaModel}`,
    };
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    return errorResponse(prismaError, prismaModel, 'DeleteFailed');
  }
}
