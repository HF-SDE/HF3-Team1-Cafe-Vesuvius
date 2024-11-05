import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { accessToken } from '@controllers/auth.controller';
import { PrismaClient } from '@prisma/client';

import { JwtPayload } from 'jsonwebtoken';


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
export const generateUserTokens = async (user: any, req: Request) => {
  const ip = req.socket.remoteAddress;

  if (!ip) return '';

  const newAccessToken = generateToken(
    { id: user.id, username: user.username },
    ip,
    process.env.ACCESS_TOKEN_EXPIRATION || '5m',
    process.env.ACCESS_TOKEN_SECRET as string,
  );
  const newRefreshToken = generateToken(
    { id: user.id, username: user.username },
    ip,
    process.env.REFRESH_TOKEN_EXPIRATION || '3d',
    process.env.REFRESH_TOKEN_SECRET as string,
  );

  const newRefreshTokenInDB = await prisma.refreshToken.create({
    data: { token: newRefreshToken, userId: user.id },
  });
  await prisma.accessToken.create({
    data: {
      token: newAccessToken,
      userId: user.id,
      refreshTokenId: newRefreshTokenInDB.id,
      sessionId: newRefreshTokenInDB.sessionId,
    },
  });

  return {
    accessToken: { token: newAccessToken, authType: 'bearer' },
  };
};

// Reomove the tokens for the session in the DB
export const invalidateRefreshToken = async (token: string) => {
  const refreshTokenInDb = await prisma.refreshToken.findUnique({
    where: { token: token },
  });
  const accessTokenInDb = await prisma.accessToken.findUnique({
    where: { token: token },
  });
  let session = refreshTokenInDb?.sessionId || accessTokenInDb?.sessionId;

  if (session) {    
    await prisma.accessToken.deleteMany({
      where: { sessionId: session },
    });
    await prisma.refreshToken.deleteMany({ 
      where: { sessionId: session } 
    });
  }
  
};

export const invalidateAllTokensForUser = async (userId: string) => {
  await prisma.accessToken.deleteMany({ where: { userId: userId } });
  await prisma.refreshToken.deleteMany({ where: { userId: userId } });
};

// Gets the newest refresh token from the DB with the same sessionId as the access token
export const getRefreshToken = async (accessToken: string, req: Request) => {
  const ip = req.socket.remoteAddress;

  const user = jwt.verify(
    accessToken,
    (process.env.ACCESS_TOKEN_SECRET as string) + ip,
    { ignoreExpiration: true },
  );
  if (!user) return null;

  const accesTokenInDb = await prisma.accessToken.findUnique({
    where: { token: accessToken },
  });

  if (!accesTokenInDb) {
    // The access token was not found in the DB
    return null;
  }

  // Find the newest accessToken
  const newestAccessToken = await prisma.accessToken.findFirst({
    where: { sessionId: accesTokenInDb.sessionId },
    orderBy: { createdAt: 'desc' },
  });

  // Check if the newest access token matches the provided access token
  if (newestAccessToken && newestAccessToken.token === accessToken) {
    // Gets the newest refresh token to return
    const newestRefreshToken = await prisma.refreshToken.findFirst({
      where: { sessionId: accesTokenInDb.sessionId },
      orderBy: { createdAt: 'desc' },
    });

    if (newestRefreshToken) {
      // Return the new refresh token
      return {
        refreshToken: { token: newestRefreshToken.token },
      };
    } else {
      // There was no available refresh token for that session
      return null;
    }
  } else {
    // The access token was either not found in the DB or not the newest.
    // All tokens for this user have been revoked
    await invalidateAllTokensForUser(accesTokenInDb.userId);
    return null;
  }
};

export const refreshUserTokens = async (refreshToken: string, req: Request) => {
  const ip = req.socket.remoteAddress;

  if (!ip) return '';

  const userTemp = jwt.verify(
    refreshToken,
    (process.env.REFRESH_TOKEN_SECRET as string) + ip,
  );
  if (!userTemp) return null;

  let user: { id: string; username: string } | null = null;

  if (typeof userTemp === 'object' && 'user' in userTemp) {
    user = (userTemp as JwtPayload).user as { id: string; username: string };
  }

  const refreshTokenInDb = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });
  const newestRefreshToken = await prisma.refreshToken.findFirst({
    where: { sessionId: refreshTokenInDb?.sessionId },
    orderBy: { createdAt: 'desc' },
  });

  if (newestRefreshToken && newestRefreshToken.token === refreshToken) {
    const newAccessToken = generateToken(
      user as object,
      ip,
      process.env.ACCESS_TOKEN_EXPIRATION || '5m',
      process.env.ACCESS_TOKEN_SECRET as string,
    );
    const newRefreshToken = generateToken(
      user as object,
      ip,
      process.env.REFRESH_TOKEN_EXPIRATION || '3d',
      process.env.REFRESH_TOKEN_SECRET as string,
    );

    const newRefreshEntry = await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: (user as any).id,
        sessionId: refreshTokenInDb?.sessionId,
      },
    });
    await prisma.accessToken.create({
      data: {
        token: newAccessToken,
        userId: (user as any).id,
        refreshTokenId: newRefreshEntry.id,
        sessionId: newRefreshEntry.sessionId,
      },
    });

    return {
      accessToken: { token: newAccessToken, authType: 'bearer' },
    };
  }

  await prisma.accessToken.deleteMany({
    where: { userId: refreshTokenInDb?.userId },
  });
  await prisma.refreshToken.deleteMany({
    where: { userId: refreshTokenInDb?.userId },
  });
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
