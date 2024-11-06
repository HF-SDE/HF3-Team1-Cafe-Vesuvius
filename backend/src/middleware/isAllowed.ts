import { NextFunction, Request, Response } from 'express';

import { Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { getHttpStatusCode } from '@utils/Utils';

type ExpressFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Middleware to check if the user has the required permissions to access a route.
 * @param {string[]} permissions - The permissions required to access the route.
 * @returns {ExpressFunction} The middleware function to check permissions.
 */
export function isAllowed(permissions: string[]): ExpressFunction {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      res.status(getHttpStatusCode(Status.Unauthorized)).json({
        status: 'Unauthorized',
        message: 'Unauthorized',
      });

      return;
    }

    const userPermissions = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        UserPermissions: {
          where: { Permission: { code: { in: permissions } } },
        },
      },
    });

    if (userPermissions) return next();

    res.status(getHttpStatusCode(Status.Forbidden)).json({
      status: 'Forbidden',
      message: 'Forbidden',
    });

    return;
  };
}
