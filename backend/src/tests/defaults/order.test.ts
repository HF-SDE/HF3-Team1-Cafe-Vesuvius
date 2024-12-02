import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { APIResponse } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Order } from '@prisma/client';

import { Response, axiosInstance as axios } from './axiosInstance';
import { login, logout } from './util';

describe('API defaults (order)', () => {
  beforeAll(login);
  afterAll(logout);

  //* Get cases
  it('should get orders', async () => {
    const response = await axios.get<{ data: APIResponse<Order[]> }>('/order');

    expect(response.status).toBe(200);
  });

  it('should get 1 or no order', async () => {
    const randomOrder = await prisma.order.findFirstOrThrow({});

    const response = await axios.get<{ data: APIResponse<Order[]> }>(
      `/order/${randomOrder.id}`,
    );

    expect(response.status).toBe(200);
  });

  //* Create cases
  it('should create a new order', async () => {
    const { id: tableId } = await prisma.table.findFirstOrThrow({});
    const { id: menuItemId } = await prisma.menuItem.findFirstOrThrow({});

    const response = await axios.post<{ data: APIResponse<Order> }>('/order', {
      tableId,
      items: [{ menuItemId, quantity: 1 }],
    });

    expect(response.status).toBe(201);
    expect(response.data).toStrictEqual({
      status: 'Created',
      message: 'Created new order',
    });
  });
});

describe('API defaults (order) [Errors]', () => {
  beforeAll(login);
  afterAll(logout);

  //* Get cases
  it('should not get a order', async () => {
    const response = await axios.get<Response>(
      '/order/0000a0a00a00a00a0aa00a00',
    );

    expect(response.data.data).toEqual([]);
  });
});
