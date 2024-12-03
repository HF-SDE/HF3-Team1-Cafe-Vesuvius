import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';

import { StatsResponse } from '../types/stats.types';

/**
 * Service to fetch statistics
 * @returns {Promise<APIResponse<StatsResponse>>} A promise that resolves to an object containing the status, message, and the statistics data.
 */
export async function stats(): Promise<APIResponse<StatsResponse>> {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const ordersForToday = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay, // Orders created after or at the start of today
          lte: endOfDay, // Orders created before or at the end of today
        },
      },
      select: {
        id: true, // Make sure to get the order ID to link with order_menu
      },
    });

    const orderMenuItems = await prisma.order_Menu.findMany({
      select: {
        menuItemPrice: true,
        quantity: true,
        orderId: true,
      },
    });

    // Filter the orderMenuItems to only include those that belong to today's orders
    const orderMenuItemsForToday = orderMenuItems.filter((item) =>
      ordersForToday.some((order) => order.id === item.orderId),
    );

    console.log(orderMenuItemsForToday);

    // Calculate total sales for all orders
    const salesTotal = orderMenuItems.reduce(
      (sum, item) => sum + item.menuItemPrice * item.quantity,
      0,
    );

    // Calculate today's sales
    const salesToday = orderMenuItemsForToday.reduce(
      (sum, item) => sum + item.menuItemPrice * item.quantity,
      0,
    );

    const ordersTotal = await prisma.order.count();
    const ordersToday = ordersForToday.length;

    const totalReservations = await prisma.reservation.count();
    const todayReservations = await prisma.reservation.count({
      where: {
        reservationTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const upcomingReservations = totalReservations - todayReservations;

    const salesByMonth = await prisma.order.findMany({
      select: {
        createdAt: true,
        Order_Menus: {
          select: {
            menuItemPrice: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const salesByMonthAggregated = salesByMonth.reduce((acc, order) => {
      const monthYear = new Date(order.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      const totalMenuItemPrice = order.Order_Menus.reduce(
        (sum, item) => sum + item.menuItemPrice,
        0,
      );

      if (!acc[monthYear]) {
        acc[monthYear] = { sales: 0, orders: 0 };
      }

      acc[monthYear].sales += totalMenuItemPrice;
      acc[monthYear].orders += 1;

      return acc;
    }, {});

    const salesMonth = Object.keys(salesByMonthAggregated).map((month) => ({
      month,
      sales: salesByMonthAggregated[month].sales,
      orders: salesByMonthAggregated[month].orders,
      reservations: totalReservations,
    }));

    const MenuItemsCount = await prisma.menuItem.count();
    const orderedItems = await prisma.order_Menu.groupBy({
      by: ['menuItemId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const lowStock = await prisma.rawMaterial.findMany({
      where: {
        quantity: {
          lte: 5,
        },
      },
    });

    const response: StatsResponse = {
      economy: {
        salesTotal: parseFloat(salesTotal.toFixed(2)),
        salesToday: parseFloat(salesToday.toFixed(2)),
        valuta: 'DKK',
        salesMonth,
      },
      reservations: {
        total: totalReservations,
        today: todayReservations,
        upcoming: upcomingReservations,
      },
      orders: {
        ordersTotal: ordersTotal,
        ordersToday: ordersToday,
        avgOrderValueTotal:
          parseFloat((salesTotal / ordersTotal).toFixed(2)) || 0,
        avgOrderValueToday:
          parseFloat((salesToday / ordersToday).toFixed(2)) || 0,
      },
      menuItems: {
        total: orderedItems.length, // MenuItemsCount
        orderedStats: orderedItems.map((item) => ({
          name: item.menuItemId,
          count: item._count.id,
        })),
      },
      rawMaterials: {
        total: lowStock.length,
        lowStock: lowStock.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
        })),
      },
    };

    return {
      status: Status.Found,
      message: 'Stat(s) found',
      data: response,
    };
  } catch (error) {
    return {
      status: Status.Failed,
      message: 'Something went wrong on our end: ' + error.message,
    };
  }
}
