import { IAPIResponse, Status } from '@api-types/general.types';
import prisma, { errorResponse } from '@prisma-instance';
import { Order_Menu, Prisma } from '@prisma/client';

/**
 * Service to update the status of an order
 * @async
 * @param {string} orderId - The ID of the order to update.
 * @param {Order_Menu[]} menuItems - The menu items to update.
 * @returns {Promise<IAPIResponse>} A promise that resolves to an object containing the status and message.
 */
export async function updateStatus(
  orderId: string,
  menuItems: Order_Menu[],
): Promise<IAPIResponse> {
  try {
    const transactions = [];
    for (const menuItem of menuItems) {
      const prismaPromise = prisma.order_Menu.update({
        where: { id: menuItem.id, AND: { orderId } },
        data: { status: menuItem.status },
      });

      transactions.push(prismaPromise);
    }

    await prisma.$transaction(transactions);

    return {
      status: Status.Updated,
      message: `Updated order statuses`,
    };
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    return errorResponse(prismaError, 'order_Menu', 'UpdateFailed');
  }
}
