import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import * as authService from '../services/auth.service';

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

/** Interface for the login request body */
interface LoginRequestBody {
  username: string;
  password: string;
}

/**
 * Handles user login, authenticates with passport, and returns tokens on successful login.
 * @param {Request<unknown, unknown, LoginRequestBody>} req - The request object containing `username` and `password` in the body.
 * @param {Response} res - The response object to send authentication results.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} Resolves with tokens on success or an error response.
 */
export async function login(
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Make sure a username and password is passed in the body
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    passport.authenticate(
      'local',
      async (err: any, user: Express.User | false) => {
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
          const tokens = await authService.generateUserTokens(
            {
              sub: user.id,
              username: user.username,
            },
            req as Request,
          )
          res.json(tokens);
        } catch (tokenError) {
          console.error('Generate token: ' + tokenError);
          throw new Error("Failed to generate tokens");
        }
      });
    })(req, res, next);
  } catch (error) {
    console.error('Login error: ' + error);
    res.status(500).json({
      status: 'ServerError',
      message: 'Something went wrong on our end',
    });
  }
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
export async function logout(
  req: Request<unknown, unknown, LogoutRequestBody>,
  res: Response,
): Promise<void> {
  try {
    // Destructure the token from the request body
    const { token } = req.body;

    // Check if the token is missing
    if (!token) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication token',
      });
      return;
    }

    // Try to revoke the session with the given token
    await authService.invalidateSession(token);

    // Return a successful response
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    // Log the error (avoid exposing sensitive information)
    console.error('Logout error:', error);

    // Return a generic error message to avoid exposing sensitive information
    res.status(500).json({
      status: 'ServerError',
      message: 'Something went wrong on our end',
    });
  }
}

// Define the interface for the request body
interface GetAccessTokenRequestBody {
  token: string;
}

/**
 * Endpoint to refresh user tokens based on the provided refresh token.
 * @param {Request<unknown, unknown, GetAccessTokenRequestBody>} req - The request object containing the refresh token in the body.
 * @param {Response} res - The response object used to send the response to the client.
 * @returns {Promise<void>} - A promise that resolves when the access token is refreshed or rejects if an error occurs.
 */
export async function getAccessToken(
  req: Request<unknown, unknown, GetAccessTokenRequestBody>,
  res: Response,
): Promise<void> {
  try {
    // Destructure the refresh token from the request body
    const { token: refreshToken } = req.body;

    // Check if the refresh token is missing
    if (!refreshToken) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication token',
      });
      return;
    }

    // Attempt to refresh tokens
    const newTokens = await authService.refreshUserTokens(
      refreshToken,
      req as Request,
    );

    // Check if new tokens were not returned (authorization failure)
    if (!newTokens) {
      res.status(403).json({
        status: 'Unauthorized',
        message: 'Not authorized',
      });
      return;
    }

    // Successfully refreshed tokens, return them in the response
    res.json(newTokens);
  } catch (error) {
    // Log the error (avoid exposing sensitive information)
    console.error('Access token error:', error);

    // Return a generic error message to avoid exposing sensitive information
    res.status(500).json({
      status: 'ServerError',
      message: 'Something went wrong on our end',
    });
  }
}

// Interface for the successful response containing the refresh token
interface RefreshTokenResponse {
  refreshToken: {
    token: string;
  };
}
// Interface for error responses
interface ErrorResponse {
  status: string;
  message: string;
}

/**
 * Endpoint to get the refresh token based on the provided access token in the authorization header.
 * @param {Request} req - The request object, containing the Authorization header.
 * @param {Response<RefreshTokenResponse | ErrorResponse>} res - The response object used to send the response to the client.
 * @returns {Promise<void>} - A promise that resolves when the refresh token is retrieved or rejects if an error occurs.
 */
export async function getRefreshToken(
  req: Request,
  res: Response<RefreshTokenResponse | ErrorResponse>,
): Promise<void> {
  try {
    // Get the authorization header from the request
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

    // Ensure the token is not empty
    const accessToken = tokenParts[1];
    if (!accessToken) {
      res.status(400).json({
        status: 'MissingData',
        message: 'Missing authentication',
      });
      return;
    }

    // Get the refresh token from the DB using the access token
    const tokens = await authService.getRefreshToken(accessToken, req);
    if (!tokens) {
      res.status(403).json({
        status: 'Unauthorized',
        message: 'Not authorized',
      });
      return;
    }

    // Return the refresh token as the response
    res.json(tokens);
  } catch (error) {
    // Log the error (avoid exposing sensitive information)
    console.error('Refresh token error:', error);

    // Return a generic error message
    res.status(500).json({
      status: 'ServerError',
      message: 'Something went wrong on our end',
    });
  }
}
