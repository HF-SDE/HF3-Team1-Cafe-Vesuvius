import { hash } from 'argon2';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Used for generating test data to the database
 */
async function main() {
  // Create Permission Groups
  await prisma.permissionGroup.createMany({
    data: [
      { name: 'Administrator' },
      { name: 'Order' },
      { name: 'Menu' },
      { name: 'Stock' },
      { name: 'Table' },
      { name: 'Reservation' },
    ],
  });

  // Create Permission
  await prisma.permission.createMany({
    data: [
      {
        code: 'administrator:stats:view',
        permissionGroupId: '1',
        description: 'See Stat',
      },
      {
        code: 'administrator:users:view',
        permissionGroupId: '1',
        description: 'See users information',
      },
      {
        code: 'administrator:users:update',
        permissionGroupId: '1',
        description: 'Update users information',
      },
      {
        code: 'administrator:users:create',
        permissionGroupId: '1',
        description: 'Create new users',
      },
      {
        code: 'administrator:users:management',
        permissionGroupId: '1',
        description: 'Give user permissions',
      },
      {
        code: 'administrator:permission:create',
        permissionGroupId: '1',
        description: 'Create new permission',
      },
      {
        code: 'administrator:permission:view',
        permissionGroupId: '1',
        description: 'View permissions and their groups',
      },
      {
        code: 'administrator:permissiongroup:create',
        permissionGroupId: '1',
        description: 'Create new permission group',
      },
      {
        code: 'order:view',
        permissionGroupId: '2',
        description: 'View order',
      },
      {
        code: 'order:create',
        permissionGroupId: '2',
        description: 'Create order',
      },
      {
        code: 'order:status:update:completed',
        permissionGroupId: '2',
        description: 'Update order status to completed',
      },
      {
        code: 'order:status:update:deliver',
        permissionGroupId: '2',
        description: 'Update order status to deliver',
      },
      {
        code: 'menu:update',
        permissionGroupId: '3',
        description: 'Update menu',
      },
      {
        code: 'menu:create',
        permissionGroupId: '3',
        description: 'Update menu',
      },
      {
        code: 'menu:delete',
        permissionGroupId: '3',
        description: 'Delete menu',
      },
      {
        code: 'stock:view',
        permissionGroupId: '4',
        description: 'View what it is in stock',
      },
      {
        code: 'stock:update',
        permissionGroupId: '4',
        description: 'Update stock',
      },
      {
        code: 'stock:create',
        permissionGroupId: '4',
        description: 'Create stock',
      },
      {
        code: 'table:view',
        permissionGroupId: '6',
        description: 'View tables',
      },
      {
        code: 'table:create',
        permissionGroupId: '6',
        description: 'Create table',
      },
      {
        code: 'table:delete',
        permissionGroupId: '6',
        description: 'Delete table',
      },
      {
        code: 'reservation:view',
        permissionGroupId: '7',
        description: 'View reservation',
      },
      {
        code: 'reservation:update',
        permissionGroupId: '7',
        description: 'Update reservation',
      },
      {
        code: 'reservation:create',
        permissionGroupId: '7',
        description: 'Create reservation',
      },
      {
        code: 'reservation:delete',
        permissionGroupId: '7',
        description: 'Delete reservation',
      },
    ],
  });

  // Create super admin user
  const superAdminUser = await prisma.user.create({
    data: {
      initials: 'AD',
      username: 'admin',
      password: await hash('admin'),
      name: 'Super Admin',
      email: 'admin@example.com',
    },
  });

  // Create kok user
  const kokUser = await prisma.user.create({
    data: {
      initials: 'KU',
      username: 'kok',
      password: await hash('12345678'),
      name: 'Kok User',
      email: 'kok@example.com',
    },
  });

  // Create Tjener user
  const tjenerUser = await prisma.user.create({
    data: {
      initials: 'TU',
      username: 'tjener',
      password: await hash('87654321'),
      name: 'Tjener User',
      email: 'tjener@example.com',
    },
  });

  // Create administration user
  const administrationUser = await prisma.user.create({
    data: {
      initials: 'TU',
      username: 'administration',
      password: await hash('administration'),
      name: 'administration User',
      email: 'administration@example.com',
    },
  });

  // Assign permissions to super admin user
  const adminPermission = await prisma.permission.findMany({
    where: {
      code: {
        startsWith: 'administrator',
      },
      AND: {
        code: {
          startsWith: 'order',
        },
        AND: {
          code: {
            startsWith: 'menu',
          },
          AND: {
            code: {
              startsWith: 'stock',
            },
            AND: {
              code: {
                startsWith: 'table',
              },
              AND: {
                code: {
                  startsWith: 'reservation',
                },
              },
            },
          },
        },
      },
    },
  });

  if (adminPermission) {
    adminPermission.forEach(async (permission) => {
      await prisma.userPermissions.create({
        data: {
          userId: superAdminUser.id,
          assignedBy: superAdminUser.id,
          permissionId: permission.id,
        },
      });
    });
  }

  // Assign permissions to kok user
  const kokPermission = await prisma.permission.findMany({
    where: {
      code: {
        equals: 'order:status:update:deliver',
      },
      AND: {
        code: {
          startsWith: 'menu',
        },
        AND: {
          code: {
            startsWith: 'stock',
          },
        },
      },
    },
  });

  if (kokPermission) {
    kokPermission.forEach(async (permission) => {
      await prisma.userPermissions.create({
        data: {
          userId: kokUser.id,
          assignedBy: kokUser.id,
          permissionId: permission.id,
        },
      });
    });
  }

  // Assign permissions to tjener user
  const tjenerPermission = await prisma.permission.findMany({
    where: {
      code: {
        equals: 'order:status:update:deliver',
      },
      AND: {
        code: {
          equals: 'order:status:update:completed',
        },
        AND: {
          code: {
            equals: 'table:view',
          },
          AND: {
            code: {
              startsWith: 'reservation',
            },
          },
        },
      },
    },
  });

  if (tjenerPermission) {
    tjenerPermission.forEach(async (permission) => {
      await prisma.userPermissions.create({
        data: {
          userId: tjenerUser.id,
          assignedBy: tjenerUser.id,
          permissionId: permission.id,
        },
      });
    });
  }

  // Assign permissions to administration user
  const administrationPermission = await prisma.permission.findMany({
    where: {
      code: {
        startsWith: 'administrator',
      },
      AND: {
        code: {
          startsWith: 'menu',
        },
        AND: {
          code: {
            startsWith: 'stock',
          },
          AND: {
            code: {
              startsWith: 'table',
            },
          },
        },
      },
    },
  });

  if (administrationPermission) {
    administrationPermission.forEach(async (permission) => {
      await prisma.userPermissions.create({
        data: {
          userId: administrationUser.id,
          assignedBy: administrationUser.id,
          permissionId: permission.id,
        },
      });
    });
  }

  // Stock
  await prisma.rawMaterials.createMany({
    data: [
      {
        name: 'jalapeno',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Cheese',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Beef',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Chicken',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Pork',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Lettuce',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Tomato',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Onion',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Bacon',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'cream fresh',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'TortillaChip',
        quantity: 100,
        unit: 'bag',
      },
      {
        name: 'Salsa',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Guacamole',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'cesar dressing',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'croutons',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'parmesan',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'chicken breast',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'heart salad',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Tiger prawn',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'cabbage salad',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'avocado',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'nudler',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'cucumber',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'carrot',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'edamame beans',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'mint',
        quantity: 100,
        unit: 'leaf',
      },
      {
        name: 'cashew nuts',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'gomadressing',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'sweet potato',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'falafel',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'baby spinach',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'pomegranate',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'bulgur',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'feta',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'basil pesto',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'pumpkin seeds',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'curry mayonnaise',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'salat',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'French fries',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'mayonnaise',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'smoked salmon',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'sandwich bread',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'pickled red onion',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'spicy chill mayo',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'chill mayo',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'tune moussé',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'brioche bun',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'minced beef',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'pickled',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'burger dressing',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'fresh basil',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'butter',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'bread',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'pasta',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'mushrooms',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'tomato sauce',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'basil',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'aperol',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'prosecco',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'sparkling water',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'orange',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'vodka',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'tequila',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'expresso',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'vanilla syrup',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'dark rum',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'kahlua',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'ginger beer',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'lime',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'gum syrup',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'rom',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'cane sugar',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'lime juice',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'gin',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'tonic',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'citrus',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'lemon',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'white rom',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'strawberry',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'mongo juice',
        quantity: 100,
        unit: 'l',
      }
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
