import { NextFunction, Request, Response } from 'express';
//import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import passport from 'passport';

import { PrismaClient } from '@prisma/client';

import * as authService from '../services/auth.service';

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
  res.json({ message: 'Signup successful' });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      res.status(400).json({
        status: 'MissingCredentials',
        message: 'Some credentials missing',
      });
      return;
    }

    if (!authService.isBase64(password)) {
      res.status(401).json({
        status: 'InvalidCredentials',
        message: 'Username or Password was not correct',
      });
    }

    const decodedPassword = Buffer.from(password, 'base64').toString();
    req.body.password = decodedPassword;

    // Change user back to type User
    passport.authenticate('login', async (err: any, user: any | false) => {
      if (err || !user) {
        res.status(401).json({
          status: 'InvalidCredentials',
          message: 'Username or Password was not correct',
        });
        return;
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          next(error);
          return;
        }

        try {
          const tokens = await authService.generateUserTokens(user, req);
          res.json(tokens);
        } catch (tokenError) {
          res.status(500).json({
            status: 'TokenError',
            message: 'Failed to generate tokens',
          });
        }
      });
    })(req, res, next);
  } catch (error) {
    res.status(500).json({
      status: 'ServerError',
      message: 'Something went wrong on our end',
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token: refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing refresh token',
      });
      return;
    }

    await authService.invalidateRefreshToken(refreshToken);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({
      status: 'ServerError',
      message: 'Something went wrong on our end',
    });
  }
};

export const accessToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token: refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication',
      });
      return;
    }

    const newTokens = await authService.refreshUserTokens(refreshToken, req);
    if (!newTokens) {
      res.status(403).json({
        status: 'Unauthorized',
        message: 'Token expired or invalid',
      });
      return;
    }

    res.json(newTokens);
  } catch (error) {
    res.status(500).json({
      status: 'ServerError',
      message: 'Something went wrong on our end',
    });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication header',
      });
      return;
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
      res.status(400).json({
        status: 'InvalidData',
        message: 'Invalid authentication format. Expected Bearer token.',
      });
      return;
    }

    const accessToken = tokenParts[1]; // Get the actual access token

    if (!accessToken) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication',
      });
      return;
    }

    const refreshToken = await authService.getRefreshToken(accessToken, req);
    if (!refreshToken) {
      res.status(403).json({
        status: 'Unauthorized',
        message: 'Token expired or invalid',
      });
      return;
    }

    res.json({ token: refreshToken });
  } catch (error) {
    res.status(500).json({
      status: 'ServerError',
      message: 'Something went wrong on our end',
    });
  }
};
