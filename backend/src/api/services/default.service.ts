/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { UuidSchema } from '@schemas/general.schemas';

type Result = any;
type prismaModels = Uncapitalize<Prisma.ModelName>;

/**
 * Service to get all records from a collection
 * @async
 * @param {prismaModels} prismaModel - The Prisma model to get the records from.
 * @param {string} id - The id of the record to get.
 * @returns {Promise<APIResponse<Result>>} A promise that resolves to an object containing the data, status, and message.
 */
export async function getAll(
  prismaModel: prismaModels,
  id?: string,
): Promise<APIResponse<Result>> {
  const validate = UuidSchema.validate(id);

  if (validate.error) {
    return {
      data: undefined,
      status: Status.MissingDetails,
      message: validate.error.message,
    };
  }

  const where = id ? { id } : undefined;

  const prismaType = prisma[prismaModel] as any;

  if (!prismaType)
    return {
      data: undefined,
      status: Status.Failed,
      message: `Database collection not found`,
    };

  const results = (await prismaType.findMany({
    where,
  })) as any[];

  return {
    data: results,
    status: Status.Success,
    message: `Found ${results.length} result(s)`,
  };
}

/**
 * Service to create a record
 * @async
 * @param {prismaModels} prismaModel - The Prisma model to create the record with.
 * @param {any} data - The data to create a record with.
 * @returns {Promise<APIResponse<Result>>} A promise that resolves to an object containing the record data, status, and message.
 */
export async function create(
  prismaModel: prismaModels,
  data: unknown,
): Promise<APIResponse<Result>> {
  try {
    const prismaType = prisma[prismaModel] as any;

    const results = (await prismaType.create({
      data,
    })) as any[];

    return {
      data: results,
      status: Status.Created,
      message: 'Record created',
    };
  } catch (error) {
    const prismaError = error as
      | Prisma.PrismaClientUnknownRequestError
      | Prisma.PrismaClientKnownRequestError;

    if (prismaError.name == 'PrismaClientValidationError') {
      return {
        data: undefined,
        status: Status.MissingDetails,
        message: 'Invalid data',
      };
    }

    if (prismaError instanceof Prisma.PrismaClientKnownRequestError) {
      if (prismaError.code === 'P2002')
        return {
          data: undefined,
          status: Status.CreationFailed,
          message: 'Table with that number already exists',
        };
    }

    return {
      data: undefined,
      status: Status.CreationFailed,
      message: 'Error creating record',
    };
  }
}

/**
 * Service to update a record
 * @async
 * @param {prismaModels} prismaModel - The Prisma model to update the record from.
 * @param {string} id - The id of the record to update.
 * @param {any} data - The data to update the record with.
 * @returns {Promise<APIResponse<Result>>} A promise that resolves to an object containing the record data, status, and message.
 */
export async function update(
  prismaModel: prismaModels,
  id: string,
  data: any,
): Promise<APIResponse<Result>> {
  const prismaType = prisma[prismaModel] as any;

  try {
    const record = await prismaType.update({
      where: { id },
      data,
    });

    return {
      data: record,
      status: Status.Success,
      message: 'Record updated',
    };
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;

    if (prismaError.name === 'PrismaClientValidationError') {
      return {
        data: undefined,
        status: Status.MissingDetails,
        message: 'Invalid data',
      };
    }

    if (prismaError.code === 'P2025') {
      return {
        data: undefined,
        status: Status.UpdateFailed,
        message: 'Record not found',
      };
    }

    return {
      data: undefined,
      status: Status.UpdateFailed,
      message: 'Error updating record',
    };
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
    const deletedRow = await prismaType.delete({ where: { id } });

    return {
      data: deletedRow,
      status: Status.Success,
      message: 'Record deleted',
    };
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;

    if (prismaError.code === 'P2025') {
      return {
        data: undefined,
        status: Status.DeleteFailed,
        message: 'Record not found',
      };
    }

    return {
      data: undefined,
      status: Status.DeleteFailed,
      message: 'Error deleting record',
    };
  }
}
