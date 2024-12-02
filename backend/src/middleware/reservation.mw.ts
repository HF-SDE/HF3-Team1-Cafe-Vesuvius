import { NextFunction, Request, Response } from 'express';

import { Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma, Table } from '@prisma/client';

interface ReservationRequest extends Request {
  body: {
    amount: number;
    tableIds?: string[];
    Tables: Prisma.ReservationCreateInput['Tables'];
    reservationTime: string;
  };
}

const resTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

/**
 * Controller to check the availability of tables
 * @async
 * @param {ReservationRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @returns {void}
 */
export async function manageTables(
  req: ReservationRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const totalCapacity = await getTotalCapacity(req.body.reservationTime);

  if (totalCapacity < req.body.amount) {
    res.status(400).json({
      status: Status.CreationFailed,
      message: 'Not enough tables available',
    });

    return;
  }

  let { tableIds } = req.body;

  if (tableIds) {
    const validTables = await checkValidSeatability(tableIds, req.body.amount);

    if (validTables.err) {
      res.status(400).json({
        status: Status.CreationFailed,
        message: validTables.message,
      });

      return;
    }
  } else {
    tableIds = await distributeTables(req);
  }

  const startTime = new Date(req.body.reservationTime);

  if (typeof startTime == 'string') {
    res.status(400).json({
      status: Status.CreationFailed,
      message: 'Invalid date',
    });

    return;
  }

  const endTime = new Date(startTime.getTime() + resTime);

  const reservedTables = await prisma.reservation.findMany({
    where: {
      tableIds: { hasSome: tableIds },
      AND: [
        { reservationTime: { lt: endTime } },
        { reservationTime: { gt: new Date(startTime.getTime() - resTime) } },
      ],
    },
  });

  if (reservedTables.length) {
    res.status(400).json({
      status: Status.CreationFailed,
      message: 'Table(s) is already reserved',
    });

    return;
  }

  req.body.Tables = { connect: tableIds.map((id) => ({ id })) };
  delete req.body.tableIds;

  next();
}

/**
 * Function to distribute available tables
 * @async
 * @param {ReservationRequest} req - The request object
 * @returns {Promise<Table["id"][]>} A promise that resolves to void
 */
export async function distributeTables(
  req: ReservationRequest,
): Promise<Table['id'][]> {
  let tables = await getAvailableTables(req.body.reservationTime);
  let partySize = req.body.amount;

  const tableToUse: Table[] = [];

  for (const table of tables) {
    if (partySize <= 0) break;

    if (table.capacity > partySize) continue;

    tableToUse.push(table);
    tables = tables.filter((t) => t !== table);

    partySize -= table.capacity;
  }

  if (partySize == 1) tableToUse.push(tables[tables.length - 1]);

  // req.body.Tables = { connect: tableToUse.map(({ id }) => ({ id })) };
  return tableToUse.map(({ id }) => id);
}

/**
 * Function to distribute available tables
 * @async
 * @param {string} reservationTime - The reservation time
 * @returns {Promise<void>} A promise that resolves to void
 */
async function getAvailableTables(reservationTime: string): Promise<Table[]> {
  const startTime = new Date(reservationTime);
  const endTime = new Date(startTime.getTime() + resTime);

  const availableTables = await prisma.table.findMany({
    where: {
      OR: [
        { Reservations: { none: {} } },
        {
          Reservations: {
            none: {
              AND: [
                { reservationTime: { lte: endTime } },
                {
                  reservationTime: {
                    gte: new Date(startTime.getTime() - resTime),
                  },
                },
              ],
            },
          },
        },
      ],
    },
    orderBy: { capacity: 'desc' },
  });

  return availableTables;
}

/**
 * Function to get the total capacity of the tables
 * @async
 * @param {string} reservationTime - The reservation time
 * @returns {Promise<number>} A promise that resolves to the total capacity
 */
async function getTotalCapacity(reservationTime: string): Promise<number> {
  const availableTables = await getAvailableTables(reservationTime);

  return availableTables.reduce((acc, table) => acc + table.capacity, 0);
}

interface IValidSeatability {
  err?: boolean;
  message?: string;
}

/**
 * Function to check if the tables are valid
 * @async
 * @param {string[]} tableIds - The table ids
 * @param {number} amount - The amount
 * @returns {Promise<IValidSeatability>} A promise that resolves to void
 */
async function checkValidSeatability(
  tableIds: string[],
  amount: number,
): Promise<IValidSeatability> {
  const duplicates = tableIds.filter((id, i) => tableIds.indexOf(id) !== i);

  if (duplicates.length) {
    return { err: true, message: 'Duplicate table IDs are not allowed' };
  }

  const tables = await prisma.table.findMany({
    where: { id: { in: tableIds } },
  });

  if (tables.length !== tableIds.length) {
    return { err: true, message: 'One or more of given tables were not found' };
  }

  const totalCapacity = tables.reduce((acc, table) => acc + table.capacity, 0);

  if (totalCapacity < amount) {
    return {
      err: true,
      message: 'Not enough selected tables for the party size',
    };
  }

  if (totalCapacity > amount + 1) {
    return {
      err: true,
      message: 'Too many selected tables for the party size',
    };
  }

  return {};
}

/**
 * Middleware to transform the filters
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function in the chain
 * @returns {void}
 */
export function transformFilters(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  req.query ??= {};

  const today = new Date().setHours(0, 0, 0, 0);

  req.query.reservationTime ??= {
    gte: new Date(today).toISOString(),
  };

  next();
}
