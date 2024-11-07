import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { UuidSchema } from '@schemas/general.schemas';

type TableResult = any;

/**
 * Service to get all tables
 * @async
 * @param {string} id - The id of the table to get.
 * @returns {Promise<APIResponse<TableResult>>} A promise that resolves to an object containing the table data, status, and message.
 */
export async function getTables(
  id?: string,
): Promise<APIResponse<TableResult>> {
  const validate = UuidSchema.validate(id);

  if (validate.error) {
    return {
      data: undefined,
      status: Status.Failed,
      message: validate.error.message,
    };
  }

  const where = id ? { id } : undefined;

  const tables = await prisma.table.findMany({
    where,
    include: { Orders: true, Reservation: true },
  });

  return {
    data: tables,
    status: Status.Success,
    message: `Found ${tables.length} table(s)`,
  };
}

/**
 * Service to create a table
 * @async
 * @param {any} data - The data to create a table with.
 * @returns {Promise<APIResponse<TableResult>>} A promise that resolves to an object containing the table data, status, and message.
 */
export async function createTable(
  data: Prisma.TableCreateInput,
): Promise<APIResponse<TableResult>> {
  const table = await prisma.table.create({
    data,
  });

  return {
    data: table,
    status: Status.Created,
    message: 'Table created',
  };
}

/**
 * Service to delete a table
 * @async
 * @param {string} id - The id of the table to delete.
 * @returns {Promise<APIResponse<TableResult>>} A promise that resolves to an object containing the table data, status, and message.
 */
export async function deleteTable(
  id: string,
): Promise<APIResponse<TableResult>> {
  const table = await prisma.table.delete({ where: { id } });

  return {
    data: table,
    status: Status.Success,
    message: 'Table deleted',
  };
}
