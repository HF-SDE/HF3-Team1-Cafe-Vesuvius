import { Response } from 'express';
import { WSResponse, isWebSocket } from 'websocket-express';

import { ExpressFunction, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { getHttpStatusCode } from '@utils/Utils';

/**
 * Middleware to check if the user has the required permissions to access a route.
 * @param {string[]} permissions - The permissions required to access the route.
 * @returns {ExpressFunction} The middleware function to check permissions.
 */
export function isAllowed(permissions: string[]): ExpressFunction {
  return async (req, res: Response | WSResponse, next) => {
    const user = req.user;

    if (!user) {
      if (isWebSocket(res)) {
        void res.accept();
        return res.sendError(
          getHttpStatusCode(Status.Unauthorized),
          getHttpStatusCode(Status.WsUnauthorized),
          JSON.stringify({
            status: 'Unauthorized',
            message: 'Unauthorized',
          }),
        );
      } else {
        res.status(getHttpStatusCode(Status.Unauthorized)).json({
          status: 'Unauthorized',
          message: 'Unauthorized',
        });
      }

      return;
    }

    const Permissions = await prisma.userPermissions.findMany({
      where: {
        AND: {
          userId: user.id,
          Permission: { code: { in: permissions } },
        },
      },
    });

    if (Permissions.length) return next();

    if (isWebSocket(res)) {
      void res.accept();
      res.sendError(
        getHttpStatusCode(Status.Forbidden),
        getHttpStatusCode(Status.WsForbidden),
        JSON.stringify({
          status: 'Forbidden',
          message: 'Forbidden',
        }),
      );
    } else {
      res.status(getHttpStatusCode(Status.Forbidden)).json({
        status: 'Forbidden',
        message: 'Forbidden',
      });
    }

    return;
  };
}
