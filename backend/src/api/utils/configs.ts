import { Prisma } from '@prisma/client';

const omit = {
  createdAt: true,
  updatedAt: true,
};

export const menuItem: Prisma.MenuItemFindManyArgs = {
  include: {
    RawMaterial_MenuItems: {
      include: { RawMaterial: true },
    },
  },

  omit,
};

export const table: Prisma.TableFindManyArgs = { omit };

export const order: Prisma.OrderFindManyArgs = { omit, include: { Order_Menus: true } };

export const reservation: Prisma.ReservationFindManyArgs = { omit, include: { Tables: true } };
