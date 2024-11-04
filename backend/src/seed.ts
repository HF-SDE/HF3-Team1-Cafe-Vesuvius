import { hash } from 'argon2';
import { ErrorCallback } from 'typescript';

import config from '@config';
import { PrismaClient } from '@prisma/client';
import { withOptimize } from '@prisma/extension-optimize';

const prisma = new PrismaClient().$extends(
  withOptimize({ apiKey: config.PRISMA_API_KEY }),
);

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
  await prisma.rawMaterial.createMany({
    data: [
      {
        name: 'Jalapeno',
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
        name: 'Sour cream',
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
        name: 'Cesar dressing',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Croutons',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Parmesan',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Chicken breast',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Heart salad',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Tiger prawn',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Coleslaw',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Avocado',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'Noodles',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Cucumber',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Carrot',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Edamame beans',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Mint',
        quantity: 100,
        unit: 'leaf',
      },
      {
        name: 'Cashew nuts',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Gomadressing',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Sweet potato',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Falafel',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Baby spinach',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Pomegranate',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Bulgur',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Feta',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Basil pesto',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Pumpkin seeds',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Curry mayonnaise',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Salad',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'French fries',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Mayonnaise',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Smoked salmon',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Sandwich bread',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'Pickled red onion',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Spicy chill mayo',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Chill mayo',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Rune moussé',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Brioche bun',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'Minced beef',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Pickled',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Burger dressing',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Fresh basil',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Butter',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Bread',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'Pasta',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Mushrooms',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Tomato sauce',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Basil',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Aperol',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Prosecco',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Sparkling water',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Orange',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'Vodka',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Tequila',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Espresso',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Vanilla syrup',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Dark rum',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Kahlua',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Ginger beer',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Lime',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'Gum syrup',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Rom',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Cane sugar',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Lime juice',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Gin',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Tonic',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Citrus',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'Lemon',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'White rom',
        quantity: 100,
        unit: 'l',
      },
      {
        name: 'Strawberry',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'Mongo juice',
        quantity: 100,
        unit: 'l',
      },
    ],
  });

  // Menu
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Nachos Supreme',
        price: 129,
        category: ['Food'],
      },
      {
        name: 'Caesar Salad',
        price: 139,
        category: ['Food'],
      },
      {
        name: "Tiger's Prawn Salad",
        price: 139,
        category: ['Food', 'Salad'],
      },
      {
        name: "Vegan's salad",
        price: 119,
        category: ['Food', 'Salad'],
      },
      {
        name: 'Club Sandwich',
        price: 139,
        category: ['Food', 'Sandwich'],
      },
      {
        name: 'Salmon Sandwich',
        price: 149,
        category: ['Food', 'Sandwich'],
      },
      {
        name: 'Spicy Steak Sandwich',
        price: 149,
        category: ['Food', 'Sandwich'],
      },
      {
        name: 'Tuna Sandwich',
        price: 139,
        category: ['Food', 'Sandwich'],
      },
      {
        name: 'Vesuvius Burger',
        price: 139,
        category: ['Food', 'Burger'],
      },
      {
        name: 'Spicy Burger',
        price: 139,
        category: ['Food', 'Burger'],
      },
      {
        name: 'Crispy Chicken Burger',
        price: 139,
        category: ['Food', 'Burger'],
      },
      {
        name: 'Tomato Soup',
        price: 99,
        category: ['Food', 'Soup'],
      },
      {
        name: 'Pasta with Chicken',
        price: 169,
        category: ['Food', 'Pasta'],
      },
      {
        name: 'Pasta with beef tenderloin',
        price: 179,
        category: ['Food', 'Pasta'],
      },
      {
        name: 'Pasta with tiger prawn',
        price: 179,
        category: ['Food', 'Pasta'],
      },
      {
        name: 'Aperol Spritzz',
        price: 85,
        category: ['Drink', 'Alcohol'],
      },
      {
        name: 'Espresso Martini',
        price: 85,
        category: ['Drink', 'Alcohol'],
      },
      {
        name: 'Dark & Stormy',
        price: 85,
        category: ['Drink', 'Alcohol'],
      },
      {
        name: 'Mojito',
        price: 85,
        category: ['Drink', 'Alcohol'],
      },
      {
        name: 'Gin Tonic',
        price: 85,
        category: ['Drink', 'Alcohol'],
      },
      {
        name: 'Moscow Mule',
        price: 85,
        category: ['Drink', 'Alcohol'],
      },
      {
        name: 'Strawberry Daiquiri',
        price: 85,
        category: ['Drink', 'Alcohol'],
      },
      {
        name: 'Gin Hass',
        price: 85,
        category: ['Drink', 'Alcohol'],
      },
    ],
  });

  // RawMaterial_MenuItem
  await prisma.rawMaterial_MenuItem.createMany({
    data: [
      // Nachos Supreme
      {
        menuItemId: await findMenuItem('Nachos Supreme'),
        rawMaterialId: await findRawMaterialItem('TortillaChip'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem('Nachos Supreme'),
        rawMaterialId: await findRawMaterialItem('Chicken'),
        quantity: 0.3,
      },
      {
        menuItemId: await findMenuItem('Nachos Supreme'),
        rawMaterialId: await findRawMaterialItem('Jalapeno'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Nachos Supreme'),
        rawMaterialId: await findRawMaterialItem('Cheese'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem('Nachos Supreme'),
        rawMaterialId: await findRawMaterialItem('Salsa'),
        quantity: 0.08,
      },
      {
        menuItemId: await findMenuItem('Nachos Supreme'),
        rawMaterialId: await findRawMaterialItem('guacamole'),
        quantity: 0.08,
      },
      {
        menuItemId: await findMenuItem('Nachos Supreme'),
        rawMaterialId: await findRawMaterialItem('Sour cream'),
        quantity: 0.04,
      },
      // Caesar Salad
      {
        menuItemId: await findMenuItem('Caesar Salad'),
        rawMaterialId: await findRawMaterialItem('Chicken breast'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Caesar Salad'),
        rawMaterialId: await findRawMaterialItem('Heart salad'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem('Caesar Salad'),
        rawMaterialId: await findRawMaterialItem('Cesar dressing'),
        quantity: 0.3,
      },
      {
        menuItemId: await findMenuItem('Caesar Salad'),
        rawMaterialId: await findRawMaterialItem('Parmesan'),
        quantity: 0.01,
      },
      {
        menuItemId: await findMenuItem('Caesar Salad'),
        rawMaterialId: await findRawMaterialItem('Croutons'),
        quantity: 0.05,
      },
      // Tiger's Prawn Salad
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('Tiger prawn'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('Coleslaw'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('Avocado'),
        quantity: 1,
      },
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('noodles'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('Cucumber'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('Carrot'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('Edamame beans'),
        quantity: 0.03,
      },
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('Mint'),
        quantity: 2,
      },
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('Cashew nuts'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem("Tiger's Prawn Salad"),
        rawMaterialId: await findRawMaterialItem('Gomadressing'),
        quantity: 0.1,
      },
      // Vegan's salad
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Sweet potato'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Falafel'),
        quantity: 0.02,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Baby spinach'),
        quantity: 0.02,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Pomegranate'),
        quantity: 0.02,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Bulgur'),
        quantity: 0.01,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Bulgur'),
        quantity: 0.01,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Feta'),
        quantity: 0.04,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Tomato'),
        quantity: 0.3,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Edamame beans'),
        quantity: 0.01,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Basil pesto'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Pumpkin seeds'),
        quantity: 0.02,
      },
      {
        menuItemId: await findMenuItem("Vegan's salad"),
        rawMaterialId: await findRawMaterialItem('Mint'),
        quantity: 2,
      },
    ],
  });
}

/**
 * Find menu item id by name
 * @async
 * @param {string} name Menu item name
 * @returns {Promise<string>} Menu item id
 */
async function findMenuItem(name: string): Promise<string> {
  try {
    const result = await prisma.menuItem.findFirst({
      where: {
        name,
      },
      select: {
        id: true,
      },
    });
    if (result) {
      return result.id;
    }
    throw new Error('Menu item not found');
  } catch (error: unknown) {
    return (error as Error).message;
  }
}

/**
 * Find RawMaterial item id by name
 * @async
 * @param {string} name RawMaterial item name
 * @returns {Promise<string>} RawMaterial item id
 */
async function findRawMaterialItem(name: string): Promise<string> {
  try {
    const result = await prisma.rawMaterial.findFirst({
      where: {
        name,
      },
      select: {
        id: true,
      },
    });
    if (result) {
      return result.id;
    }
    throw new Error('Menu item not found');
  } catch (error: unknown) {
    return (error as Error).message;
  }
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
