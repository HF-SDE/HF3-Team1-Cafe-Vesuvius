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

const defaultTableInclude = {
  omit: {
    ...omit,
    reservationIds: true,
  },
};

export const table: Prisma.TableFindManyArgs = defaultTableInclude;

export const order: Prisma.OrderFindManyArgs = {
  omit,
  include: {
    Order_Menus: true,
    Table: defaultTableInclude,
  },
};

export const reservation: Prisma.ReservationFindManyArgs = {
  omit: {
    ...omit,
    tableIds: true,
  },
  include: { Tables: defaultTableInclude },
};
