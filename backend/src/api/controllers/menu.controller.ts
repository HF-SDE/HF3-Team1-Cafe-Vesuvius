import { NextFunction, Request, Response } from 'express';

import { Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma, RawMaterial, RawMaterial_MenuItem } from '@prisma/client';
import { getHttpStatusCode } from '@utils/Utils';

interface CustomRawMaterialMenuItem {
  quantity: number;
  RawMaterial?: RawMaterial;
}

interface MenuRequest extends Request {
  body: {
    RawMaterial_MenuItems:
      | (CustomRawMaterialMenuItem & RawMaterial_MenuItem)[]
      | Prisma.MenuItemCreateInput['RawMaterial_MenuItems'];
  };
}

/**
 * Controller to transform the menus array
 * @async
 * @param {MenuRequest} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>} The response object
 */
export async function transformMenusItems(
  req: MenuRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const RawMaterialMenuItems = req.body
    .RawMaterial_MenuItems as (CustomRawMaterialMenuItem &
    RawMaterial_MenuItem)[];

  if (!RawMaterialMenuItems) {
    res.status(getHttpStatusCode(Status.MissingDetails)).json({
      status: Status.MissingDetails,
      message: 'No materials provided',
    });

    return;
  }

  // const ids = RawMaterialMenuItems.map((material) => material.rawMaterialId);

  // await prisma.rawMaterial.findMany({ where: { id: { in: ids } } });

  for (const material of RawMaterialMenuItems) {
    if ('RawMaterial' in material) {
      material.rawMaterialId = material.RawMaterial!.id;
      delete material.RawMaterial;
    }

    const menuItem = await prisma.rawMaterial.findUnique({
      where: { id: material.rawMaterialId },
    });

    if (!menuItem) {
      res.status(getHttpStatusCode(Status.NotFound)).json({
        status: Status.NotFound,
        message: 'Menu item not found: ' + material.rawMaterialId,
      });

      return;
    }
  }

  req.body.RawMaterial_MenuItems = {
    createMany: { data: RawMaterialMenuItems },
  };

  next();
}
