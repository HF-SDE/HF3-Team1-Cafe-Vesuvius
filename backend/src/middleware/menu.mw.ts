import { NextFunction, Request, Response } from 'express';

import { Status } from '@api-types/general.types';
import { MenuItem, Prisma, RawMaterial_MenuItem } from '@prisma/client';
import { getHttpStatusCode } from '@utils/Utils';

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
 * @returns {void}
 */
export function transformPatch(
  req: MenuRequest,
  res: Response,
  next: NextFunction,
): void {
  const RawMaterialMenuItems = req.body.RawMaterial_MenuItems;

  if (!RawMaterialMenuItems) {
    next();
  }

  if (RawMaterialMenuItems.length === 0) {
    res.status(getHttpStatusCode(Status.MissingDetails)).json({
      status: Status.MissingDetails,
      message: 'RawMaterial_MenuItems cannot be empty',
    });

    return;
  }

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
