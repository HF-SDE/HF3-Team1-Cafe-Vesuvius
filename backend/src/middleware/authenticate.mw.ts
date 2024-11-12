import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { Status } from '@api-types/general.types';
import { defaultResponse, getHttpStatusCode } from '@utils/Utils';

import '../passport';

/**
 * Verifies the JWT token in the request header.
 * @param {Request} req - The request object containing the JWT token.
 * @param {Response} res - The response object to send the result of the verification.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} Resolves with the user data if the token is valid.
 */
export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  passport.authenticate(
    'jwt',
    { session: false },
    (err: number, user: Express.User) => {
      const errResponse = defaultResponse(err);

      if (errResponse) return res.status(err).json(errResponse);

      if (!user) {
        return res
          .status(getHttpStatusCode(Status.Unauthorized))
          .json(defaultResponse(401));
      }

      req.user = user;

      next();
    },
  )(req, res, next);
}
