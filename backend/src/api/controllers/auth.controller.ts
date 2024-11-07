import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';

import { LoginRequestBody } from '@api-types/auth.types';
import { PrismaClient } from '@prisma/client';
//import passport from 'passport';
import { getHttpStatusCode } from '@utils/Utils';

import * as AuthService from '../services/auth.service';

const prisma = new PrismaClient();

/**
 * Handles user signup by creating a new user with a hashed password.
 * @param {Request} req - The request object (unused here for data).
 * @param {Response} res - The response object to send the result of the signup operation.
 * @returns {Promise<void>} Resolves with a success or error message.
 */
export async function signUp(req: Request, res: Response) {
  try {
    const username = 'admin';

    const password = 'admin';
    // Hash the password before saving
    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword, // Store the hashed password
        initials: 'Adm',
        email: 'admin@admin.com',
        name: 'Admin',
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
}

/**
 * Handles user login, authenticates with passport, and returns tokens on successful login.
 * @param {Request} req - The request object containing `username` and `password` in the body.
 * @param {Response} res - The response object to send authentication results.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} Resolves with tokens on success or an error response.
 */
export async function login(
  req: Request,
  res: Response,
  //next: NextFunction,
): Promise<void> {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  const userObject: LoginRequestBody = {
    username: username ?? undefined,
    password: password ?? undefined,
    ip: req.socket.remoteAddress as string,
  };

  const response = await AuthService.login(userObject);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

// Define the interface for the request body
interface LogoutRequestBody {
  token: string;
}

/**
 * Logs out a user by invalidating their session token.
 * @param {Request<unknown, unknown, LogoutRequestBody>} req - The request object, containing the token in the body.
 * @param {Response} res - The response object used to send the response to the client.
 * @returns {Promise<void>} - A promise that resolves when the logout is complete or rejects if an error occurs.
 */
export async function logout(req: Request, res: Response): Promise<void> {
  const { token } = req.body as { token: string };
  const response = await AuthService.logout(token);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Endpoint to refresh user tokens based on the provided refresh token.
 * @param {Request<unknown, unknown, GetAccessTokenRequestBody>} req - The request object containing the refresh token in the body.
 * @param {Response} res - The response object used to send the response to the client.
 * @returns {Promise<void>} - A promise that resolves when the access token is refreshed or rejects if an error occurs.
 */
export async function getAccessToken(
  req: Request,
  res: Response,
): Promise<void> {
  const { token } = req.body as { token: string };
  const response = await AuthService.accessToken({
    token,
    ip: req.socket.remoteAddress as string,
  });

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Endpoint to get the refresh token based on the provided access token in the authorization header.
 * @param {Request} req - The request object, containing the Authorization header.
 * @param {Response<RefreshTokenResponse | ErrorResponse>} res - The response object used to send the response to the client.
 * @returns {Promise<void>} - A promise that resolves when the refresh token is retrieved or rejects if an error occurs.
 */
export async function getRefreshToken(
  req: Request,
  res: Response,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(400).json({
      status: 'MissingData',
      message: 'Missing authentication',
    });
    return;
  }

  // Ensure it is a bearer token
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
    res.status(400).json({
      status: 'MissingData',
      message: 'Missing authentication',
    });
    return;
  }
  const token = tokenParts[1];

  const response = await AuthService.refreshToken({
    token,
    ip: req.socket.remoteAddress as string,
  });

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
