import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: any, user: Express.User) => {
      if (err || !user) {
        return res.status(401).json({
          status: 'Unauthorized',
          message: 'Unauthorized',
        });
      }

      next();
    },
  )(req, res, next);
}
