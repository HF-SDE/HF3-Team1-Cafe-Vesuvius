import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import * as authService from '../services/auth.service';
import { token } from 'morgan';

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
  try {
    const username = 'admin';

    const password = 'admin';
    // Hash the password before saving
    const hashedPassword = await argon2.hash(password);

    // Extract additional fields from req.body
    const { initials, email, name } = req.body;


    const user = await prisma.user.create({
      data: {
        username: "admin",
        password: hashedPassword, // Store the hashed password
        initials: "Adm",
        email: "admin@admin.com",
        name: "Admin",
      },
    });
    console.log(user);

    res.json({ message: 'Signup successful', userData: user });

    //return done(null, user);
  } catch (error) {
    //return done(error);
    console.log(error);
    res.json({ message: 'Signup error', errorMess: error });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Make sure a username and password is passed in the body
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      res.status(400).json({
        status: 'MissingCredentials',
        message: 'Some credentials missing',
      });
      return;
    }

    // Makes sure that the password is encoded to base64
    if (!authService.isBase64(password)) {
      res.status(401).json({
        status: 'InvalidCredentials',
        message: 'Username or Password was not correct',
      });
      return;
    }

    // Decode the password from base64
    const decodedPassword = Buffer.from(password, 'base64').toString();
    req.body.password = decodedPassword;

    // Authenticate the user using passport
    passport.authenticate('local', async (err: any, user: any | false) => {
      // Makes sure that theire was no errors in the authentication and that the user is valid
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
          throw new Error("Failed to generate tokens");
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
    // Make sure a token is passed in the body
    const { token } = req.body;
    if (!token) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication',
      });
      return;
    }

    // Try to revoke the session
    await authService.invalidateSession(token);

    // Return ok every time to avoide exploit
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
    // Make sure a token is passed in the body
    const { token: refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication',
      });
      return;
    }

    // Attempt to refresh tokens
    const newTokens = await authService.refreshUserTokens(refreshToken, req);

    if (!newTokens) {
      res.status(403).json({
        status: 'Unauthorized',
        message: 'Not authorized',
      });
      return;
    }

    // Successfully refreshed tokens
    res.json(newTokens);
  } catch (error) {
    console.log(error);
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
    // Make sure it has a auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication',
      });
      return;
    }

    // Makes sure its a bearer token that has ben passed
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication',
      });
      return;
    }

    // Makes sure that the token is filed out
    const accessToken = tokenParts[1];
    if (!accessToken) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication',
      });
      return;
    }

    // Get the refresh token from the DB with the access token
    const refreshToken = await authService.getRefreshToken(accessToken, req);
    if (!refreshToken) {
      res.status(403).json({
        status: 'Unauthorized',
        message: 'Not authorized',
      });
      return;
    }

    res.json(refreshToken);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'ServerError',
      message: 'Something went wrong on our end',
    });
  }
};
