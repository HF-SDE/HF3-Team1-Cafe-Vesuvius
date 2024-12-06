import { NextFunction, Request, Response } from 'express';

import { Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Permission, Prisma, UserPermissions } from '@prisma/client';

interface CustomRawMaterialMenuItem {
  Permission?: Permission;
}

interface ManageRequest extends Request {
  body: {
    UserPermissions:
      | (CustomRawMaterialMenuItem & UserPermissions)[]
      | Prisma.UserCreateInput['UserPermissions'];
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

  console.log(req.body);

  console.log(userPermissions);
  //console.log(req.body.UserPermissions);

  next();
}
