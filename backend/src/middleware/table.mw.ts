import { NextFunction, Request, Response } from 'express';

import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { search } from '@schemas/table.schema';

interface TableRequest extends Request {
  query: {
    id?: string;
    reservedNow?: string;
    number?: string;
  };

  config?: Prisma.TableFindManyArgs;
}

/**
 * Middleware to transform the search query to a valid search
 * @param {OrderRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @returns {Promise<void>}
 */
export async function transformSearch(
  req: TableRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const validatedSearch = search.validate(req.query);

  if (validatedSearch.error) {
    res.status(400).json({
      status: 'Failed',
      message: validatedSearch.error.message,
    });

    return;
  }

  const { value } = validatedSearch;

  req.query = { ...value } as TableRequest['query'];

  delete req.query.reservedNow;

  if (value.reservedNow !== undefined) {
    req.config = {
      where: {
        Reservations: {
          some: {
            reservationTime: {
              lt: new Date(),
              gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 3),
            },
          },
        },
      },
    };
  }

  next();
}
