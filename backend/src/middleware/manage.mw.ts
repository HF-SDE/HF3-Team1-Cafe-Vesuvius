import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';

import { Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Permission, Prisma, User, UserPermissions } from '@prisma/client';

/**
 *
 * @param password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) {
    console.error('Error while hashing the password:', error);
    throw new Error('Could not hash the password');
  }
}

interface CustomRawMaterialMenuItem {
  Permission?: Permission;
}

interface ManageRequest extends Request {
  body: {
    UserPermissions:
      | (CustomRawMaterialMenuItem & UserPermissions)[]
      | Prisma.UserCreateInput['UserPermissions'];
    password?: string;
  };
}

/**
 * Controller to transform the permissions array into the correct format
 * @async
 * @param {ManageRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>} The response object
 */
export async function transformPermissions(
  req: ManageRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userPermissions = req.body
    .UserPermissions as (CustomRawMaterialMenuItem & UserPermissions)[];

  console.log(userPermissions);

  if (!userPermissions) {
    res.status(400).json({
      status: Status.MissingDetails,
      message: 'No permissions provided',
    });
    return;
  }

  // Transform permissions into the UserPermission format
  for (const userPermission of userPermissions) {
    if ('Permission' in userPermission) {
      userPermission.permissionId = userPermission.Permission!.id;
      delete userPermission.Permission;
    }

    const permission = await prisma.permission.findUnique({
      where: { id: userPermission.permissionId },
    });
    console.log(permission);

    if (!permission) {
      res.status(400).json({
        status: Status.NotFound,
        message: 'Permission not found: ' + userPermission.permissionId,
      });

      return;
    }
  }

  req.body.UserPermissions = {
    createMany: { data: userPermissions },
  };

  if (req.body.password) {
    // Decode the password from Base64
    const decodedPassword = Buffer.from(req.body.password, 'base64').toString(
      'utf8',
    );

    // Hash the decoded password
    req.body.password = await hashPassword(decodedPassword);
  }

  console.log(req.body);

  console.log(userPermissions);
  //console.log(req.body.UserPermissions);

  next();
}

interface MenuItemAndRawMaterialMenuItem extends User {
  UserPermissions: UserPermissions[];
}

/**
 * Middleware to transform the patch request
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @returns {Promise<void>}
 */
export async function transformPatch(
  req: ManageRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userPermissions = req.body
    .UserPermissions as (CustomRawMaterialMenuItem & UserPermissions)[];
  if (!userPermissions) {
    next();
  }

  // if (!userPermissions || userPermissions.length === 0) {
  //   res.status(getHttpStatusCode(Status.MissingDetails)).json({
  //     status: Status.MissingDetails,
  //     message: 'UserPermissions cannot be empty',
  //   });

  //   return;
  // }

  if (userPermissions && userPermissions.length > 0) {
    for (const material of userPermissions) {
      if (material.Permission) material.permissionId = material.Permission.id;
    }
  }

  const data = {
    ...req.body,
    UserPermissions: {
      deleteMany: {},
      ...(Array.isArray(req.body.UserPermissions) &&
      req.body.UserPermissions.length > 0
        ? {
            createMany: {
              data: req.body.UserPermissions,
            },
          }
        : {}),
    },
  } as Prisma.UserUpdateInput;

  req.body = data as MenuItemAndRawMaterialMenuItem;

  if (req.body.password) {
    // Decode the password from Base64
    const decodedPassword = Buffer.from(req.body.password, 'base64').toString(
      'utf8',
    );

    // Hash the decoded password
    req.body.password = await hashPassword(decodedPassword);
  }

  next();
}
