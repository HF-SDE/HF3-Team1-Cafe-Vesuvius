import { NextFunction, Request, Response } from 'express';

import { Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { getHttpStatusCode } from '@utils/Utils';

export function isAllowed(permissions: string[]) {
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
