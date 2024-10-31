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
    ],
  });

  // Create Permission
  await prisma.permission.createMany({
    data: [
      {
        code: 'administrator:view:stats',
        permissionGroupId: '1',
        description: 'See Stat',
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
        code: 'administrator:view:stats',
        permissionGroupId: '1',
        description: 'See Stat',
      },
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
