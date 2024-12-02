import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';

import { StatsResponse } from '../types/stats.types';

/**
 * Service to fetch statistics
 * @returns {Promise<APIResponse<StatsResponse>>} A promise that resolves to an object containing the status, message, and the statistics data.
 */
export async function stats(): Promise<APIResponse<StatsResponse>> {
  try {
    const orderMenuItems = await prisma.order_Menu.findMany({
      select: {
        menuItemPrice: true,
        quantity: true,
      },
    });

    const totalSales = orderMenuItems.reduce(
      (sum, item) => sum + item.menuItemPrice * item.quantity,
      0,
    );

    const totalOrders = await prisma.order.count();
    const completedOrders = 2;
    const pendingOrders = 3;
    // const completedOrders = await prisma.order.count({
    //   where: { status: 'completed' },
    // });
    // const pendingOrders = await prisma.order.count({
    //   where: { status: 'pending' },
    // });

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
    const mostOrderedItems = await prisma.order_Menu.groupBy({
      by: ['menuItemId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 3,
    });

    const leastOrderedItems = await prisma.order_Menu.groupBy({
      by: ['menuItemId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'asc',
        },
      },
      take: 3,
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
        totalSales: totalSales,
        valuta: 'DKK',
        avgOrderValue: totalSales / totalOrders || 0,
        salesMonth,
      },
      reservations: {
        total: totalReservations,
        today: todayReservations,
        upcoming: upcomingReservations,
      },
      orders: {
        total: totalOrders,
        today: pendingOrders,
        completed: completedOrders,
        pending: pendingOrders,
      },
      menuItems: {
        total: MenuItemsCount,
        mostOrdered: mostOrderedItems.map((item) => ({
          name: item.menuItemId,
          count: item._count.id,
        })),
        leastOrdered: leastOrderedItems.map((item) => ({
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
