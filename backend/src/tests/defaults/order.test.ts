import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { APIResponse } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Order } from '@prisma/client';

import { Response, axiosInstance as axios } from './axiosInstance';
import TestCases from './generateTest';
import { login, logout } from './util';

describe('Order endpoints', () => {
  const testCases = new TestCases<Order>('/order', {
    getAll: 'Order(s) found',
    create: 'Created new order',
  });

  beforeAll(login);
  afterAll(logout);

  describe('Get cases', async () => {
    const { id: randomId } = await prisma.order.findFirstOrThrow({});

    it('should get orders', testCases.getAllTest());
    it('should get 1 or no order', testCases.getOneTest(randomId));
  });

  describe('Create cases', async () => {
    const { id: tableId } = await prisma.table.findFirstOrThrow({});
    const { id: menuItemId } = await prisma.menuItem.findFirstOrThrow({});

    const createBody = { tableId, items: [{ menuItemId, quantity: 1 }] };

    it('Create a new order', testCases.createTest(createBody));
  });

  describe('Erros', () => {
    it('should not get a order', async () => {
      const response = await axios.get<Response>(
        '/order/0000a0a00a00a00a0aa00a00',
      );

      expect(response.data.data).toEqual([]);
    });
  });
});
