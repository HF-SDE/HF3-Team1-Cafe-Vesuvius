import { afterAll, afterEach, beforeAll, describe, it } from 'vitest';

import prisma from '@prisma-instance';
import { MenuItem } from '@prisma/client';

import TestCases from './generateTest';
import { login, logout } from './util';

describe('API defaults (order)', () => {
  const testCases = new TestCases<MenuItem>('/menu', {
    getAll: 'MenuItem(s) found',
    create: 'Created new menuItem',
  });

  beforeAll(login);
  afterAll(logout);

  afterEach(async () => {
    testCases.cleanUp();
  });

  describe('Get cases', async () => {
    const { id: randomId } = await prisma.menuItem.findFirstOrThrow({});

    it('Get menus', testCases.getAllTest());
    it('Get 1 or no menu', testCases.getOneTest(randomId));
  });

  describe('Create cases', async () => {
    const rawMaterial = await prisma.rawMaterial.findFirstOrThrow({});

    const createBody = {
      name: 'test',
      category: ['test'],
      price: 1337,
      RawMaterial_MenuItems: [{ rawMaterialId: rawMaterial.id, quantity: 1 }],
    };

    it('Create a new menu', testCases.createTest(createBody));
  });
});
