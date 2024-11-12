import { IAPIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';

/**
 * Service to create a stock item
 * @param {Prisma.OrderCreateInput} data - The data to create a stock item.
 * @returns {Promise<IAPIResponse>} A promise that resolves to an object containing the status and message.
 */
export async function create(
  data: Prisma.OrderCreateInput,
): Promise<IAPIResponse> {
  try {
    const result = await prisma.order.create({
      data,
    });

    if (!result) {
      return {
        status: Status.MissingDetails,
        message: 'Order not found',
      };
    }

    return {
      status: Status.Created,
      message: 'Order created',
    };
  } catch {
    return {
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}
