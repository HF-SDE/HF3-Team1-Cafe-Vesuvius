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
        permissionGroupId: await findPermissionGroup('Administrator'),
        description: 'See Stat',
      },
      {
        code: 'administrator:users:view',
        permissionGroupId: await findPermissionGroup('Administrator'),
        description: 'See users information',
      },
      {
        code: 'administrator:users:update',
        permissionGroupId: await findPermissionGroup('Administrator'),
        description: 'Update users information',
      },
      {
        code: 'administrator:users:create',
        permissionGroupId: await findPermissionGroup('Administrator'),
        description: 'Create new users',
      },
      {
        code: 'administrator:users:management',
        permissionGroupId: await findPermissionGroup('Administrator'),
        description: 'Give user permissions',
      },
      {
        code: 'administrator:permission:create',
        permissionGroupId: await findPermissionGroup('Administrator'),
        description: 'Create new permission',
      },
      {
        code: 'administrator:permission:view',
        permissionGroupId: await findPermissionGroup('Administrator'),
        description: 'View permissions and their groups',
      },
      {
        code: 'administrator:permissiongroup:create',
        permissionGroupId: await findPermissionGroup('Administrator'),
        description: 'Create new permission group',
      },
      {
        code: 'order:view',
        permissionGroupId: await findPermissionGroup('Order'),
        description: 'View order',
      },
      {
        code: 'order:create',
        permissionGroupId: await findPermissionGroup('Order'),
        description: 'Create order',
      },
      {
        code: 'order:status:update:completed',
        permissionGroupId: await findPermissionGroup('Order'),
        description: 'Update order status to completed',
      },
      {
        code: 'order:status:update:deliver',
        permissionGroupId: await findPermissionGroup('Order'),
        description: 'Update order status to deliver',
      },
      {
        code: 'menu:update',
        permissionGroupId: await findPermissionGroup('Menu'),
        description: 'Update menu',
      },
      {
        code: 'menu:create',
        permissionGroupId: await findPermissionGroup('Menu'),
        description: 'Update menu',
      },
      {
        code: 'menu:delete',
        permissionGroupId: await findPermissionGroup('Menu'),
        description: 'Delete menu',
      },
      {
        code: 'stock:view',
        permissionGroupId: await findPermissionGroup('Stock'),
        description: 'View what it is in stock',
      },
      {
        code: 'stock:update',
        permissionGroupId: await findPermissionGroup('Stock'),
        description: 'Update stock',
      },
      {
        code: 'stock:create',
        permissionGroupId: await findPermissionGroup('Stock'),
        description: 'Create stock',
      },
      {
        code: 'table:view',
        permissionGroupId: await findPermissionGroup('Table'),
        description: 'View tables',
      },
      {
        code: 'table:create',
        permissionGroupId: await findPermissionGroup('Table'),
        description: 'Create table',
      },
      {
        code: 'table:delete',
        permissionGroupId: await findPermissionGroup('Table'),
        description: 'Delete table',
      },
      {
        code: 'reservation:view',
        permissionGroupId: await findPermissionGroup('Reservation'),
        description: 'View reservation',
      },
      {
        code: 'reservation:update',
        permissionGroupId: await findPermissionGroup('Reservation'),
        description: 'Update reservation',
      },
      {
        code: 'reservation:create',
        permissionGroupId: await findPermissionGroup('Reservation'),
        description: 'Create reservation',
      },
      {
        code: 'reservation:delete',
        permissionGroupId: await findPermissionGroup('Reservation'),
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
      initials: 'ADMINI',
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
          assignedBy: superAdminUser.id,
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
          assignedBy: superAdminUser.id,
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
          assignedBy: superAdminUser.id,
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
        name: 'Tune moussé',
        quantity: 100,
        unit: 'kg',
      },
      {
        name: 'Brioche bun',
        quantity: 100,
        unit: 'pcs',
      },
      {
        name: 'Minced Beef',
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
        name: 'Mango juice',
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
        name: 'Pasta with Beef tenderloin',
        price: 179,
        category: ['Food', 'Pasta'],
      },
      {
        name: 'Pasta with tiger prawn',
        price: 179,
        category: ['Food', 'Pasta'],
      },
      {
        name: 'Aperol Spritz',
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
        rawMaterialId: await findRawMaterialItem('Guacamole'),
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
        rawMaterialId: await findRawMaterialItem('Noodles'),
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

      // Club Sandwich
      {
        menuItemId: await findMenuItem('Club Sandwich'),
        rawMaterialId: await findRawMaterialItem('Chicken breast'),
        quantity: 0.065,
      },
      {
        menuItemId: await findMenuItem('Club Sandwich'),
        rawMaterialId: await findRawMaterialItem('Bacon'),
        quantity: 0.01,
      },
      {
        menuItemId: await findMenuItem('Club Sandwich'),
        rawMaterialId: await findRawMaterialItem('Curry mayonnaise'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Club Sandwich'),
        rawMaterialId: await findRawMaterialItem('Tomato'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Club Sandwich'),
        rawMaterialId: await findRawMaterialItem('Salad'),
        quantity: 0.05,
      },

      // Salmon Sandwich
      {
        menuItemId: await findMenuItem('Salmon Sandwich'),
        rawMaterialId: await findRawMaterialItem('Smoked salmon'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Salmon Sandwich'),
        rawMaterialId: await findRawMaterialItem('Basil pesto'),
        quantity: 0.02,
      },
      {
        menuItemId: await findMenuItem('Salmon Sandwich'),
        rawMaterialId: await findRawMaterialItem('Salad'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Salmon Sandwich'),
        rawMaterialId: await findRawMaterialItem('Avocado'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem('Salmon Sandwich'),
        rawMaterialId: await findRawMaterialItem('Pickled red onion'),
        quantity: 0.07,
      },
      {
        menuItemId: await findMenuItem('Salmon Sandwich'),
        rawMaterialId: await findRawMaterialItem('Mayonnaise'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem('Salmon Sandwich'),
        rawMaterialId: await findRawMaterialItem('French fries'),
        quantity: 0.2,
      },

      // Spicy Steak Sandwich
      {
        menuItemId: await findMenuItem('Spicy Steak Sandwich'),
        rawMaterialId: await findRawMaterialItem('Beef'),
        quantity: 0.08,
      },
      {
        menuItemId: await findMenuItem('Spicy Steak Sandwich'),
        rawMaterialId: await findRawMaterialItem('Salad'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Spicy Steak Sandwich'),
        rawMaterialId: await findRawMaterialItem('Guacamole'),
        quantity: 0.01,
      },
      {
        menuItemId: await findMenuItem('Spicy Steak Sandwich'),
        rawMaterialId: await findRawMaterialItem('Jalapeno'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Spicy Steak Sandwich'),
        rawMaterialId: await findRawMaterialItem('Pickled red onion'),
        quantity: 0.07,
      },
      {
        menuItemId: await findMenuItem('Spicy Steak Sandwich'),
        rawMaterialId: await findRawMaterialItem('Spicy chill mayo'),
        quantity: 0.02,
      },
      {
        menuItemId: await findMenuItem('Spicy Steak Sandwich'),
        rawMaterialId: await findRawMaterialItem('Mayonnaise'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem('Spicy Steak Sandwich'),
        rawMaterialId: await findRawMaterialItem('French fries'),
        quantity: 0.2,
      },

      // Tuna Sandwich
      {
        menuItemId: await findMenuItem('Tuna Sandwich'),
        rawMaterialId: await findRawMaterialItem('Tune moussé'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Tuna Sandwich'),
        rawMaterialId: await findRawMaterialItem('Salad'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Tuna Sandwich'),
        rawMaterialId: await findRawMaterialItem('Avocado'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem('Tuna Sandwich'),
        rawMaterialId: await findRawMaterialItem('Pickled red onion'),
        quantity: 0.07,
      },
      {
        menuItemId: await findMenuItem('Tuna Sandwich'),
        rawMaterialId: await findRawMaterialItem('Basil pesto'),
        quantity: 0.02,
      },
      {
        menuItemId: await findMenuItem('Tuna Sandwich'),
        rawMaterialId: await findRawMaterialItem('Mayonnaise'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem('Tuna Sandwich'),
        rawMaterialId: await findRawMaterialItem('French fries'),
        quantity: 0.2,
      },

      // Vesuvius Burger
      {
        menuItemId: await findMenuItem('Vesuvius Burger'),
        rawMaterialId: await findRawMaterialItem('Minced Beef'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Vesuvius Burger'),
        rawMaterialId: await findRawMaterialItem('Brioche bun'),
        quantity: 1,
      },
      {
        menuItemId: await findMenuItem('Vesuvius Burger'),
        rawMaterialId: await findRawMaterialItem('Salad'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Vesuvius Burger'),
        rawMaterialId: await findRawMaterialItem('Pickled'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Vesuvius Burger'),
        rawMaterialId: await findRawMaterialItem('Tomato'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Vesuvius Burger'),
        rawMaterialId: await findRawMaterialItem('Pickled red onion'),
        quantity: 0.07,
      },
      {
        menuItemId: await findMenuItem('Vesuvius Burger'),
        rawMaterialId: await findRawMaterialItem('Burger dressing'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Vesuvius Burger'),
        rawMaterialId: await findRawMaterialItem('French fries'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Vesuvius Burger'),
        rawMaterialId: await findRawMaterialItem('Mayonnaise'),
        quantity: 0.5,
      },

      // Spicy Burger
      {
        menuItemId: await findMenuItem('Spicy Burger'),
        rawMaterialId: await findRawMaterialItem('Minced Beef'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Spicy Burger'),
        rawMaterialId: await findRawMaterialItem('Brioche bun'),
        quantity: 1,
      },
      {
        menuItemId: await findMenuItem('Spicy Burger'),
        rawMaterialId: await findRawMaterialItem('Salad'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Spicy Burger'),
        rawMaterialId: await findRawMaterialItem('Tomato'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Spicy Burger'),
        rawMaterialId: await findRawMaterialItem('Jalapeno'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Spicy Burger'),
        rawMaterialId: await findRawMaterialItem('Pickled red onion'),
        quantity: 0.07,
      },
      {
        menuItemId: await findMenuItem('Spicy Burger'),
        rawMaterialId: await findRawMaterialItem('Spicy chill mayo'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Spicy Burger'),
        rawMaterialId: await findRawMaterialItem('French fries'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Spicy Burger'),
        rawMaterialId: await findRawMaterialItem('Mayonnaise'),
        quantity: 0.5,
      },

      // Crispy Chicken Burger
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('Chicken'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('Brioche bun'),
        quantity: 1,
      },
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('Salad'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('Tomato'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('Pickled red onion'),
        quantity: 0.07,
      },
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('Spicy chill mayo'),
        quantity: 0.02,
      },
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('Jalapeno'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('Guacamole'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('Mayonnaise'),
        quantity: 0.5,
      },
      {
        menuItemId: await findMenuItem('Crispy Chicken Burger'),
        rawMaterialId: await findRawMaterialItem('French fries'),
        quantity: 0.2,
      },

      // Tomato Soup
      {
        menuItemId: await findMenuItem('Tomato Soup'),
        rawMaterialId: await findRawMaterialItem('Tomato'),
        quantity: 1,
      },
      {
        menuItemId: await findMenuItem('Tomato Soup'),
        rawMaterialId: await findRawMaterialItem('Sour cream'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Tomato Soup'),
        rawMaterialId: await findRawMaterialItem('Basil'),
        quantity: 0.01,
      },
      {
        menuItemId: await findMenuItem('Tomato Soup'),
        rawMaterialId: await findRawMaterialItem('Bread'),
        quantity: 1,
      },
      {
        menuItemId: await findMenuItem('Tomato Soup'),
        rawMaterialId: await findRawMaterialItem('Butter'),
        quantity: 0.01,
      },

      // Pasta with Chicken
      {
        menuItemId: await findMenuItem('Pasta with Chicken'),
        rawMaterialId: await findRawMaterialItem('Pasta'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Pasta with Chicken'),
        rawMaterialId: await findRawMaterialItem('Chicken'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Pasta with Chicken'),
        rawMaterialId: await findRawMaterialItem('Mushrooms'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Pasta with Chicken'),
        rawMaterialId: await findRawMaterialItem('Parmesan'),
        quantity: 0.01,
      },

      // Pasta with Beef tenderloin
      {
        menuItemId: await findMenuItem('Pasta with Beef tenderloin'),
        rawMaterialId: await findRawMaterialItem('Pasta'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Pasta with Beef tenderloin'),
        rawMaterialId: await findRawMaterialItem('Beef'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Pasta with Beef tenderloin'),
        rawMaterialId: await findRawMaterialItem('Mushrooms'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Pasta with Beef tenderloin'),
        rawMaterialId: await findRawMaterialItem('Parmesan'),
        quantity: 0.01,
      },

      // Pasta with tiger prawn
      {
        menuItemId: await findMenuItem('Pasta with tiger prawn'),
        rawMaterialId: await findRawMaterialItem('Pasta'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Pasta with tiger prawn'),
        rawMaterialId: await findRawMaterialItem('Tiger prawn'),
        quantity: 0.2,
      },
      {
        menuItemId: await findMenuItem('Pasta with tiger prawn'),
        rawMaterialId: await findRawMaterialItem('Tomato sauce'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Pasta with tiger prawn'),
        rawMaterialId: await findRawMaterialItem('Parmesan'),
        quantity: 0.01,
      },
      {
        menuItemId: await findMenuItem('Pasta with tiger prawn'),
        rawMaterialId: await findRawMaterialItem('Basil'),
        quantity: 0.01,
      },

      // Aperol Spritz
      {
        menuItemId: await findMenuItem('Aperol Spritz'),
        rawMaterialId: await findRawMaterialItem('Aperol'),
        quantity: 0.04,
      },
      {
        menuItemId: await findMenuItem('Aperol Spritz'),
        rawMaterialId: await findRawMaterialItem('Prosecco'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Aperol Spritz'),
        rawMaterialId: await findRawMaterialItem('Sparkling water'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Aperol Spritz'),
        rawMaterialId: await findRawMaterialItem('Orange'),
        quantity: 0.1,
      },

      // Espresso Martini
      {
        menuItemId: await findMenuItem('Espresso Martini'),
        rawMaterialId: await findRawMaterialItem('Espresso'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Espresso Martini'),
        rawMaterialId: await findRawMaterialItem('Kahlua'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Espresso Martini'),
        rawMaterialId: await findRawMaterialItem('Vodka'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Espresso Martini'),
        rawMaterialId: await findRawMaterialItem('Vanilla syrup'),
        quantity: 0.02,
      },

      // Dark & Stormy
      {
        menuItemId: await findMenuItem('Dark & Stormy'),
        rawMaterialId: await findRawMaterialItem('Dark rum'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Dark & Stormy'),
        rawMaterialId: await findRawMaterialItem('Ginger beer'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Dark & Stormy'),
        rawMaterialId: await findRawMaterialItem('Lime juice'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Dark & Stormy'),
        rawMaterialId: await findRawMaterialItem('Gum syrup'),
        quantity: 0.1,
      },

      // Mojito
      {
        menuItemId: await findMenuItem('Mojito'),
        rawMaterialId: await findRawMaterialItem('Rom'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Mojito'),
        rawMaterialId: await findRawMaterialItem('Lime juice'),
        quantity: 0.1,
      },

      {
        menuItemId: await findMenuItem('Mojito'),
        rawMaterialId: await findRawMaterialItem('Lime'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Mojito'),
        rawMaterialId: await findRawMaterialItem('Cane sugar'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Mojito'),
        rawMaterialId: await findRawMaterialItem('Mint'),
        quantity: 2,
      },

      // Gin Tonic
      {
        menuItemId: await findMenuItem('Gin Tonic'),
        rawMaterialId: await findRawMaterialItem('Gin'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Gin Tonic'),
        rawMaterialId: await findRawMaterialItem('Tonic'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Gin Tonic'),
        rawMaterialId: await findRawMaterialItem('Citrus'),
        quantity: 0.1,
      },

      // Moscow Mule
      {
        menuItemId: await findMenuItem('Moscow Mule'),
        rawMaterialId: await findRawMaterialItem('Vodka'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Moscow Mule'),
        rawMaterialId: await findRawMaterialItem('Ginger beer'),
        quantity: 0.01,
      },
      {
        menuItemId: await findMenuItem('Moscow Mule'),
        rawMaterialId: await findRawMaterialItem('Lime juice'),
        quantity: 0.05,
      },

      // Strawberry Daiquiri
      {
        menuItemId: await findMenuItem('Strawberry Daiquiri'),
        rawMaterialId: await findRawMaterialItem('White rom'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Strawberry Daiquiri'),
        rawMaterialId: await findRawMaterialItem('Strawberry'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Strawberry Daiquiri'),
        rawMaterialId: await findRawMaterialItem('Lime juice'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Strawberry Daiquiri'),
        rawMaterialId: await findRawMaterialItem('Gum syrup'),
        quantity: 0.05,
      },

      // Gin Hass
      {
        menuItemId: await findMenuItem('Gin Hass'),
        rawMaterialId: await findRawMaterialItem('Gin'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Gin Hass'),
        rawMaterialId: await findRawMaterialItem('Mango juice'),
        quantity: 0.1,
      },
      {
        menuItemId: await findMenuItem('Gin Hass'),
        rawMaterialId: await findRawMaterialItem('Lime juice'),
        quantity: 0.05,
      },
      {
        menuItemId: await findMenuItem('Gin Hass'),
        rawMaterialId: await findRawMaterialItem('Lemon'),
        quantity: 0.1,
      },
    ],
  });

  // Table
  await prisma.table.createMany({
    data: [
      {
        number: 1,
      },
      {
        number: 2,
      },
      {
        number: 3,
      },
      {
        number: 4,
      },
      {
        number: 5,
      },
      {
        number: 6,
      },
      {
        number: 7,
      },
      {
        number: 8,
      },
      {
        number: 9,
      },
      {
        number: 10,
      },
      {
        number: 11,
      },
      {
        number: 12,
      },
      {
        number: 13,
      },
      {
        number: 14,
      },
      {
        number: 15,
      },
      {
        number: 16,
      },
      {
        number: 17,
      },
      {
        number: 18,
      },
      {
        number: 19,
      },
      {
        number: 20,
      },
      {
        number: 21,
      },
      {
        number: 22,
      },
      {
        number: 23,
      },
      {
        number: 24,
      },
      {
        number: 25,
      },
      {
        number: 26,
      },
      {
        number: 27,
      },
      {
        number: 28,
      },
    ],
  });
}

/**
 * Find permission group id by name
 * @async
 * @param {string} name Permission group name
 * @returns {Promise<string>} Permission group id
 */
async function findPermissionGroup(name: string): Promise<string> {
  try {
    const result = await prisma.permissionGroup.findFirst({
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
    throw new Error('Permission group not found');
  } catch (error: unknown) {
    return (error as Error).message;
  }
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
    throw new Error(`Menu item not found ${name}`);
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
    throw new Error(`Row item not found ${name}`);
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
