import { APIResponse, IAPIResponse, Status } from '@api-types/general.types';
import prisma, { errorResponse } from '@prisma-instance';
import { Order_Menu, Prisma } from '@prisma/client';
import schema from '@schemas/order.schema';

interface IData {
  tableId: string;
  Order_Menus: Order_Menu[];
}

/**
 * Service to get all orders
 * @async
 * @param {IData} data - The menu items to update.
 * @returns {Promise<APIResponse<any>>} A promise that resolves to an object containing the status and data.
 */
export async function createOrder(data: IData): Promise<APIResponse<any>> {
  const validation = schema.validate(data);

  if (validation.error) {
    return {
      status: Status.CreationFailed,
      message: validation.error.message,
    };
  }

  const stockUpdatePromises = [];

  const OrderMenus = validation.value.Order_Menus;

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: OrderMenus.map((o) => o.menuItemId) } },
    include: { RawMaterial_MenuItems: { include: { RawMaterial: true } } },
  });

  for (const orderMenu of OrderMenus) {
    const menuItem = menuItems.find((mi) => mi.id === orderMenu.menuItemId);
    if (!menuItem) continue;

    orderMenu.menuItemPrice = menuItem.price;

    for (const { quantity, RawMaterial } of menuItem.RawMaterial_MenuItems) {
      const quantityUsed = quantity * orderMenu.quantity;
      const quantityInStock = RawMaterial.quantity;

      if (quantityInStock < quantityUsed) {
        return {
          status: Status.CreationFailed,
          message: `Not enough stock for ${menuItem.name}`,
        };
      }

      const newQuantity = quantityInStock - quantityUsed;
      const newQuantityFixed = Math.round(newQuantity * 10) / 10;

      const prismaPromise = prisma.rawMaterial.update({
        where: { id: RawMaterial.id },
        data: { quantity: newQuantityFixed },
      });

      stockUpdatePromises.push(prismaPromise);
    }
  }

  try {
    const tableId = validation.value.tableId;

    const orderPromise = prisma.order.create({
      data: {
        tableId,
        Order_Menus: { createMany: { data: OrderMenus } },
      },
    });

    await prisma.$transaction([orderPromise, ...stockUpdatePromises]);

    return {
      status: Status.Created,
      message: 'Created new order',
    };
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    return errorResponse(prismaError, 'order', 'CreationFailed');
  }
}
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
      message: 'Updated order',
    };
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    return errorResponse(prismaError, 'order_Menu', 'UpdateFailed');
  }
}
