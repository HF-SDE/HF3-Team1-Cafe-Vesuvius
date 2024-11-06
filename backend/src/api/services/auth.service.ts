import { Request } from 'express';
import jwt from 'jsonwebtoken';

//import { JwtPayload } from 'jsonwebtoken';
import config from '@config';
import { PrismaClient, Session } from '@prisma/client';

const prisma = new PrismaClient();

interface TokenUser {
  sub: string;
  username: string;
}

/**
 * Generates a JSON Web Token (JWT) for the given user.
 * @param {UserToken} user - The user object to encode in the token payload.
 * @param {string | null} ip - The IP address to include in the secret for additional security, or null if not available.
 * @param {string} expiration - The expiration time for the token, e.g., "1h", "30m", etc.
 * @param {string} secret - The secret key used to sign the JWT.
 * @returns {string} The generated JWT token.
 */
function generateToken(
  user: TokenUser,
  ip: string | null,
  expiration: string,
  secret: string,
): string {
  return jwt.sign({ user }, secret + (ip || ''), { expiresIn: expiration });
}

// Define the expected structure for the user
interface User {
  id: string;
  username: string;
}

/**
 * Generates new access and refresh tokens for the user and stores them in the database.
 * If a session is not provided, a new session will be created.
 * @param {User} user - The user for whom tokens are being generated.
 * @param {Request} req - The request object containing the user's IP address.
 * @param {Session} [session] - Optional session to associate the tokens with. If not provided, a new session will be created.
 * @returns {Promise<{ accessToken: { token: string, authType: string } }>} An object containing the new access token.
 */
export async function generateUserTokens(
  user: TokenUser,
  req: Request,
  session?: Session,
): Promise<{ accessToken: { token: string; authType: string } }> {
  const ip = req.socket.remoteAddress;

  if (!ip) {
    throw new Error('IP address is missing');
  }

  const newAccessToken = generateToken(
    { sub: user.sub, username: user.username },
    ip,
    config.ACCESS_TOKEN_EXPIRATION,
    config.ACCESS_TOKEN_SECRET,
  );
  const newRefreshToken = generateToken(
    { sub: user.sub, username: user.username },
    ip,
    config.REFRESH_TOKEN_EXPIRATION,
    config.REFRESH_TOKEN_SECRET,
  );

  const databaseEntryExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

  if (!session) {
    // Create a session if not provided
    console.log('Creating new session');
    session = await prisma.session.create({
      data: {
        userId: user.sub,
        expiresAt: databaseEntryExpiresAt,
      },
    });
    console.log(session);
  }

  // Create the new tokens in the database
  if (session) {
    await prisma.token.create({
      data: {
        sessionId: session.id,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  }

  // Return the new access token in a structured object
  return {
    accessToken: { token: newAccessToken, authType: 'bearer' },
  };
}

/**
 * Invalidates the session associated with the provided token by deleting the session and all associated tokens in the database.
 * @param {string} token - The token (either access or refresh) whose associated session should be invalidated.
 * @returns {Promise<void>} A promise that resolves once the session and tokens have been deleted.
 * @throws {Error} If there is an error during the session or token removal process.
 */
export async function invalidateSession(token: string): Promise<void> {
  const foundToken = await prisma.token.findFirst({
    where: {
      OR: [{ accessToken: token }, { refreshToken: token }],
    },
    include: {
      session: true,
    },
  });

  if (foundToken && foundToken.sessionId) {
    // Delete the session and all associated tokens
    await prisma.session.delete({
      where: {
        id: foundToken.sessionId,
      },
    });
  }
}

/**
 * Invalidates all tokens for a user by deleting their associated sessions in the database.
 * @param {string} userId - The unique identifier of the user whose tokens should be invalidated.
 * @returns {Promise<void>} A promise that resolves once the tokens have been invalidated.
 */
export async function invalidateAllTokensForUser(
  userId: string,
): Promise<void> {
  await prisma.session.deleteMany({ where: { userId: userId } });
}

/**
 * Retrieves the newest refresh token from the database for the same session as the provided access token.
 * @param {string} accessToken - The access token for which the refresh token is being requested.
 * @param {Request} req - The request object, which includes the IP address for token verification.
 * @returns {Promise<object | null>} A promise that resolves to an object containing the refresh token if valid, or `null` if the access token is invalid or expired.
 * @throws {Error} If there is an error during token verification or database operations.
 */
export async function getRefreshToken(accessToken: string, req: Request) {
  const ip = req.socket.remoteAddress;

  const user = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET + ip, {
    ignoreExpiration: true,
  });
  if (!user) return null;

  const tokensInDb = await prisma.token.findUnique({
    where: { accessToken: accessToken },
    include: {
      session: true,
    },
  });

  if (!tokensInDb) {
    // The access token was not found in the DB
    return null;
  }

  // Find the newest accessToken
  const newestTokens = await prisma.token.findFirst({
    where: { sessionId: tokensInDb.sessionId },
    orderBy: { createdAt: 'desc' },
  });

  // Check if the newest access token matches the provided access token
  if (newestTokens && newestTokens.accessToken === accessToken) {
    // Gets the newest refresh token to return

    if (newestTokens.refreshToken) {
      // Return the new refresh token
      return {
        refreshToken: { token: newestTokens.refreshToken },
      };
    } else {
      // There was no available refresh token for that session
      return null;
    }
  } else {
    // The access token was either not found in the DB or not the newest.
    // All tokens for this user have been revoked
    await invalidateAllTokensForUser(tokensInDb.session.userId);
    return null;
  }
}

/**
 * Refreshes the user's tokens by verifying the provided refresh token, checking the latest token in the database,
 * and generating new tokens if the refresh token is valid.
 * @param {string} refreshToken - The refresh token to verify and use to generate new tokens.
 * @param {Request} req - The request object containing information like the user's IP address.
 * @returns {Promise<object | null>} A promise that resolves to an object containing the new tokens if valid, or `null` if the token is invalid or expired.
 * @throws {Error} If there is an error during the token verification or database operations.
 */
export async function refreshUserTokens(
  refreshToken: string,
  req: Request, // Type the `req` as an Express Request
): Promise<object | null> {
  const ip = req.socket.remoteAddress; // TypeScript now recognizes `req.socket`

  if (!ip) return null; // If no IP is found, return null

  // Verify the refresh token with the user's IP address as a secret key
  let userTemp: TokenUser | null = null;
  try {
    userTemp = jwt.verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET + ip,
    ) as TokenUser;
  } catch {
    // Handle the verification failure gracefully
    return null;
  }

  // If the userTemp is valid and contains 'user', assign it to user
  let user: TokenUser | null = null;

  if (userTemp) {
    user = userTemp; // Directly access the user property now that TypeScript knows the structure
  }

  if (!user) {
    return null; // Return null if the user is not found
  }

  // Fetch the tokens from the database based on the refresh token
  const tokensInDb = await prisma.token.findUnique({
    where: { refreshToken: refreshToken },
    include: {
      session: true,
    },
  });

  if (!tokensInDb || !tokensInDb.session) {
    return null; // Return null if the token or session is not found
  }

  const newestRefreshToken = await prisma.token.findFirst({
    where: { sessionId: tokensInDb.sessionId },
    orderBy: { createdAt: 'desc' },
  });

  // Check if the refresh token in the database matches the provided one
  if (newestRefreshToken && newestRefreshToken.refreshToken === refreshToken) {
    const result = generateUserTokens(
      {
        sub: user?.sub || '',
        username: user?.username || '',
      },
      req,
      tokensInDb?.session,
    );

    // const newAccessToken = generateToken(
    //   user as object,
    //   ip,
    //   config.ACCESS_TOKEN_EXPIRATION,
    //   config.ACCESS_TOKEN_SECRET,
    // );
    // const newRefreshToken = generateToken(
    //   user as object,
    //   ip,
    //   config.REFRESH_TOKEN_EXPIRATION,
    //   config.REFRESH_TOKEN_SECRET,
    // );

    // const newRefreshEntry = await prisma.refreshToken.create({
    //   data: {
    //     token: newRefreshToken,
    //     userId: (user as any).id,
    //     sessionId: refreshTokenInDb?.sessionId,
    //   },
    // });
    // await prisma.accessToken.create({
    //   data: {
    //     token: newAccessToken,
    //     userId: (user as any).id,
    //     refreshTokenId: newRefreshEntry.id,
    //     sessionId: newRefreshEntry.sessionId,
    //   },
    // });

    // return {
    //   accessToken: { token: newAccessToken, authType: 'bearer' },
    // };
    return result;
  }

  // If the refresh token does not match, invalidate all tokens for the user
  await invalidateAllTokensForUser(tokensInDb.session.userId);
  return null;
}
/**
 * Checks if a given string is Base64 encoded.
 * @param {string} str - The string to check.
 * @returns {boolean} `true` if the string is Base64 encoded, otherwise `false`.
 */
export function isBase64(str: string): boolean {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch {
    return false;
  }
}
