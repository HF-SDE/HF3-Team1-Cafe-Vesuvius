import { NextFunction, Request, Response } from 'express';

import { MenuItem, Prisma, RawMaterial_MenuItem } from '@prisma/client';

interface RawMaterialMenuItem {
  id?: string;
  quantity: number;
  RawMaterial?: RawMaterial_MenuItem;
  rawMaterialId: string;
}

interface MenuItemAndRawMaterialMenuItem extends MenuItem {
  RawMaterial_MenuItems: RawMaterialMenuItem[];
}

interface MenuRequest extends Request {
  body: MenuItemAndRawMaterialMenuItem;
}

/**
 * Middleware to transform the patch request
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @returns {Promise<void>}
 */
export async function transformPatch(
  req: MenuRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const RawMaterialMenuItems = req.body.RawMaterial_MenuItems;

  for (const material of RawMaterialMenuItems) {
    if (material.RawMaterial) material.rawMaterialId = material.RawMaterial.id;
  }

  const data = {
    ...req.body,
    RawMaterial_MenuItems: {
      deleteMany: {},
      createMany: {
        data: req.body.RawMaterial_MenuItems,
      },
    },
  } as Prisma.MenuItemUpdateInput;

  req.body = data as MenuItemAndRawMaterialMenuItem;

  next();
}
