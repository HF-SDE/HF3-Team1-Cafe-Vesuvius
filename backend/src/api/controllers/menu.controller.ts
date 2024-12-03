import { NextFunction, Request, Response } from 'express';

import prisma from '@prisma-instance';
import { Prisma, RawMaterial_MenuItem } from '@prisma/client';

interface MenuRequest extends Request {
  body: {
    RawMaterial_MenuItems:
      | RawMaterial_MenuItem[]
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
    .RawMaterial_MenuItems as RawMaterial_MenuItem[];

  if (!RawMaterialMenuItems) {
    res.status(400).json({
      status: 'Failed',
      message: 'No materials provided',
    });

    return;
  }

  for (const material of RawMaterialMenuItems) {
    const menuItem = await prisma.rawMaterial.findUnique({
      where: { id: material.rawMaterialId },
    });

    if (!menuItem) {
      res.status(400).json({
        status: 'Failed',
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
