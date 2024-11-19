import { IAPIResponse, Status } from '@api-types/general.types';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientPSQL  } from '@prisma/clientPSQL';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();
export const prismaPSQL = new PrismaClientPSQL();
export default prisma;

/**
 * Function to handle error responses
 * @param {PrismaClientKnownRequestError} err - The error object.
 * @param {keyof typeof Status} operation - The operation that caused the error.
 * @returns {IAPIResponse} An object containing the status and message.
 */
export function errorResponse(
  err: PrismaClientKnownRequestError,
  operation: keyof typeof Status,
): IAPIResponse {
  if (err.name == 'PrismaClientValidationError') {
    return {
      status: Status.MissingDetails,
      message: 'Invalid input',
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return {
          status: Status[operation],
          message: 'Record already exists',
        };

      case 'P2025':
        return {
          status: Status[operation],
          message: 'Record not found',
        };
    }
  }

  return {
    status: Status[operation],
    message: 'Error',
  };
}
