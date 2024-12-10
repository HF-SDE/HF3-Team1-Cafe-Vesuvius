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

    // Fetch reservations that are older than today's date (not future reservations)
    const pastReservations = await prisma.reservation.findMany({
      where: {
        reservationTime: {
          lt: startOfDay, // Only consider past reservations
        },
      },
      select: {
        reservationTime: true,
        tableIds: true, // Assuming 'tables' is a relation field for the reserved tables
      },
    });

    const reservationsGroupedByDays: {
      [key: string]: {
        date: Date;
        reservations: { reservationTime: Date; tableIds: string[] }[];
      };
    } = {};

    for (const reservation of pastReservations) {
      const dayKey = reservation.reservationTime.toISOString().split('T')[0]; // Extracts the date part (YYYY-MM-DD)

      // If the group for the day does not exist, create it
      if (!Object.prototype.hasOwnProperty.call(reservationsGroupedByDays, dayKey)) {
        // eslint-disable-next-line security/detect-object-injection
        reservationsGroupedByDays[dayKey] = {
          date: new Date(reservation.reservationTime),
          reservations: [],
        };
      }

      // Add the reservation to the respective day's group
      // eslint-disable-next-line security/detect-object-injection
      reservationsGroupedByDays[dayKey].reservations.push({
        reservationTime: reservation.reservationTime,
        tableIds: reservation.tableIds,
      });
    }

    const dailyUtilizationPercentages: number[] = [];

    const totalTables = await prisma.table.count();

    const totalTimeUnitsPossible = totalTables * 12;

    // Iterate over each group of reservations by day
    for (const group of Object.values(reservationsGroupedByDays)) {
      const totalTimeUnitsUsed = group.reservations.reduce(
        (sum, reservation) => sum + reservation.tableIds.length * 3,
        0,
      );

      const percentageForDay =
        (totalTimeUnitsUsed / totalTimeUnitsPossible) * 100;
      // for (const reservation of group.reservations) {
      //   const dayStart = new Date(reservation.reservationTime);
      //   dayStart.setHours(0, 0, 0, 0); // Set the time to the start of the day
      //   const dayEnd = new Date(reservation.reservationTime);
      //   dayEnd.setHours(23, 59, 59, 999); // Set the time to the end of the day

      //   // Fetch the total tables available for this day

      //   // Fetch the number of unique tables reserved for this specific day
      //   const tablesUsed = reservation.tableIds.length;

      //   // Calculate the table utilization percentage for this day
      //   const utilizationPercentage = (tablesUsed / totalTables) * 100;

      //   // Add to the daily utilization array
      // }
      dailyUtilizationPercentages.push(percentageForDay);
    }

    // Step 2: Calculate the average table utilization percentage
    const averageUtilizationPercentage =
      dailyUtilizationPercentages.length > 0
        ? dailyUtilizationPercentages.reduce((acc, curr) => acc + curr, 0) /
          dailyUtilizationPercentages.length
        : 0;

    const totalReservations = await prisma.reservation.count();
    const todayReservations = await prisma.reservation.count({
      where: {
        reservationTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const upcomingReservations = await prisma.reservation.count({
      where: {
        reservationTime: {
          gte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    //const upcomingReservations = totalReservations - todayReservations;

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
        createdAt: 'asc',
      },
    });

    const salesByMonthAggregated = salesByMonth.reduce(
      (
        acc: {
          [key: string]: {
            month: string;
            year: string;
            sales: number;
            orders: number;
            reservations?: number;
          };
        },
        order,
      ) => {
        const date = new Date(order.createdAt);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' });

        // Create a unique key for grouping
        const key = `${year}-${month}`;

        const totalMenuItemPrice = order.Order_Menus.reduce(
          (sum, item) => sum + item.menuItemPrice,
          0,
        );

        if (!Object.prototype.hasOwnProperty.call(acc, key)) {
          // eslint-disable-next-line security/detect-object-injection
          acc[key] = { month, year: year.toString(), sales: 0, orders: 0 };
        }

        if (Object.prototype.hasOwnProperty.call(acc, key)) {
          // eslint-disable-next-line security/detect-object-injection
          acc[key].sales += totalMenuItemPrice;
          // eslint-disable-next-line security/detect-object-injection
          acc[key].orders += 1;
        }

        return acc;
      },
      {},
    );

    // Transform the aggregated data into the desired structure
    const salesMonth = Object.values(salesByMonthAggregated).map((entry) => ({
      year: entry.year,
      month: entry.month,
      sales: entry.sales,
      orders: entry.orders,
      reservations: totalReservations,
    }));

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

    // Step 2: Fetch related data from the 'MenuItem' model based on menuItemId
    const menuItems = await prisma.menuItem.findMany();

    // Combine the data
    const orderedItemsWithMenuInfo = menuItems.map((item) => {
      //const menuItem = menuItems.find((menu) => menu.id === item.menuItemId);
      const count: number =
        orderedItems.find((orderline) => orderline.menuItemId === item.id)
          ?._count.id || 0;

      return {
        count,
        menuItemName: item ? item.name : null, // Include any other fields you need from menuItem
      };
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
        tableUtilizationPercentage: parseFloat(
          averageUtilizationPercentage.toFixed(2),
        ),
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
        total: orderedItemsWithMenuInfo.length, // MenuItemsCount
        orderedStats: orderedItemsWithMenuInfo.map((item) => ({
          name: item.menuItemName as string,
          count: item.count,
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
      message: 'Something went wrong on our end: ' + (error as Error).message,
    };
  }
}
