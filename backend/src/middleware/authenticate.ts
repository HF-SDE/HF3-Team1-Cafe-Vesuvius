import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { err, user } = await passport.authenticate('jwt', { session: false });

  if (err) return next(err);

  if (!user) {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'Unauthorized',
    });
  }

  req.user = user;
  return next();
}