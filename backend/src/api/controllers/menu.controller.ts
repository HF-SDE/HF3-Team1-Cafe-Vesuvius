import { NextFunction, Request, Response } from 'express';

import prisma from '@prisma-instance';
import { Prisma, RawMaterial_MenuItem } from '@prisma/client';

interface MenuRequest extends Request {
  body: {
    materials?: RawMaterial_MenuItem[];
  } & Prisma.MenuItemCreateInput
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
  const { materials } = req.body;
  delete req.body.materials;

  if (!materials) {
    res.status(400).json({
      status: 'Failed',
      message: 'No materials provided',
    });

    return;
  }

  for (const material of materials) {
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

  req.body.RawMaterial_MenuItems = { createMany: { data: materials } };

  next();
}
