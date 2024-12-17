import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { WSResponse, isWebSocket } from 'websocket-express';

import { Status } from '@api-types/general.types';
import { getHttpStatusCode } from '@utils/Utils';

import '../passport';

/**
 * Verifies the JWT token in the request header.
 * @param {Request} req - The request object containing the JWT token.
 * @param {Response} res - The response object to send the result of the verification.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {void} Resolves with the user data if the token is valid.
 */
export function verifyJWT(
  req: Request,
  res: Response | WSResponse,
  next: NextFunction,
): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  passport.authenticate(
    'jwt',
    { session: false },
    (err: number, user: Express.User) => {
      const unauthorizedResponse = {
        status: Status.Unauthorized,
        message: 'Unauthorized',
      };

      if (err) return res.status(err).json(unauthorizedResponse);

      if (!user) {
        if (isWebSocket(res)) {
          void res.accept();
          return res.sendError(
            getHttpStatusCode(Status.Unauthorized),
            getHttpStatusCode(Status.WsUnauthorized),
            JSON.stringify(unauthorizedResponse),
          );
        }
        return res
          .status(getHttpStatusCode(Status.Unauthorized))
          .json(unauthorizedResponse);
      }

      req.user = user;
      next();
    },
  )(req, res, next);
}
