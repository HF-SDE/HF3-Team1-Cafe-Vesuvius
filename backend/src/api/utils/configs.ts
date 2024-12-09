import { Prisma } from '@prisma/client';

const omit = {
  createdAt: true,
  updatedAt: true,
};

export const menuItem: Prisma.MenuItemFindManyArgs = {
  include: { RawMaterial_MenuItems: { include: { RawMaterial: { omit } } } },

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
  omit: { tableId: true },
  include: {
    Order_Menus: {
      include: { Menu: { omit } },
      omit: {
        menuItemId: true,
        orderId: true,
      },
    },
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

export const user: Prisma.UserFindManyArgs = {
  omit: {
    ...omit,
    password: true,
  },
  include: {
    UserPermissions: {
      select: {
        Permission: {
          select: {
            code: true,
            description: true,
            id: true,
          },
        },
        assignedBy: true,
      },
    },
  },
};
