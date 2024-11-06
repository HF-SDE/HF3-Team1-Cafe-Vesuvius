import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { accessToken } from '@controllers/auth.controller';
import { PrismaClient } from '@prisma/client';

import { JwtPayload } from 'jsonwebtoken';

import config from '@config';
import { Session } from 'inspector/promises';


const prisma = new PrismaClient();

const generateToken = (
  user: object,
  ip: string | null,
  expiration: string,
  secret: string,
): string => {
  return jwt.sign({ user }, secret + ip, { expiresIn: expiration });
};

// Change user type back to User
export const generateUserTokens = async (user: any, req: Request, session?: any) => {
  const ip = req.socket.remoteAddress;

  if (!ip) return '';

  const newAccessToken = generateToken(
    { id: user.id, username: user.username },
    ip,
    config.ACCESS_TOKEN_EXPIRATION,
    config.ACCESS_TOKEN_SECRET,
  );
  const newRefreshToken = generateToken(
    { id: user.id, username: user.username },
    ip,
    config.REFRESH_TOKEN_EXPIRATION,
    config.REFRESH_TOKEN_SECRET,
  );

  const databaseEntryExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

  //const databaseEntryExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute from now

  // if (sessionId) {
  //   const updateOldRefreshForSession = await prisma.refreshToken.updateMany({
  //     where: { sessionId: sessionId },
  //     data: {
  //       expiresAt: databaseEntryExpiresAt,
  //     },
  //   });
  //   const updateOldAccessForSession = await prisma.accessToken.updateMany({
  //     where: { sessionId: sessionId },
  //     data: {
  //       expiresAt: databaseEntryExpiresAt,
  //     },
  //   });
  // }
  if (!session) {
    // Create a session
    console.log("Creating new session");

    
    session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: databaseEntryExpiresAt,
      }
    })
    console.log(session);


  }

  if (session) {
    const newTokens = await prisma.token.create({
      data: {
        sessionId: session.id,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    })
  }


  return {
    accessToken: { token: newAccessToken, authType: 'bearer' },
  };
};


// Reomove the tokens for the session in the DB
export const invalidateSession = async (token: string) => {
  const foundToken = await prisma.token.findFirst({
    where: {
      OR: [
        { accessToken: token },
        { refreshToken: token },
      ],
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
};

export const invalidateAllTokensForUser = async (userId: string) => {
  await prisma.session.deleteMany({ where: { userId: userId } });
};

// Gets the newest refresh token from the DB with the same sessionId as the access token
export const getRefreshToken = async (accessToken: string, req: Request) => {
  const ip = req.socket.remoteAddress;

  const user = jwt.verify(
    accessToken,
    (config.ACCESS_TOKEN_SECRET + ip),
    { ignoreExpiration: true },
  );
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
};

export const refreshUserTokens = async (refreshToken: string, req: Request) => {
  const ip = req.socket.remoteAddress;

  if (!ip) return '';

  const userTemp = jwt.verify(
    refreshToken,
    (config.REFRESH_TOKEN_SECRET + ip),
  );
  if (!userTemp) return null;

  let user: { id: string; username: string } | null = null;

  if (typeof userTemp === 'object' && 'user' in userTemp) {
    user = (userTemp as JwtPayload).user as { id: string; username: string };
  }

  const tokensInDb = await prisma.token.findUnique({
    where: { refreshToken: refreshToken },
    include: {
      session: true,
    },
  });


  const newestRefreshToken = await prisma.token.findFirst({
    where: { sessionId: tokensInDb?.sessionId },
    orderBy: { createdAt: 'desc' },
  });

  if (newestRefreshToken && newestRefreshToken.refreshToken === refreshToken) {
    const result = generateUserTokens(user, req, tokensInDb?.session);










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

  if (tokensInDb && tokensInDb.session) {
    invalidateAllTokensForUser(tokensInDb.session.userId);
  }
  return null;
};

// To check if a string is base64 encoded
export const isBase64 = (str: string) => {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch (e) {
    return false;
  }
};
