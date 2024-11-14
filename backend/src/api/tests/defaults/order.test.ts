import { describe, expect, expectTypeOf, it } from 'vitest';

import { APIResponse } from '@api-types/general.types';
import { Order } from '@prisma/client';

import { Response, axiosInstance as axios } from './axiosInstance';

describe('API defaults (order)', () => {
  //* Get cases
  it('should get orders', async () => {
    const response = await axios.get<{ data: APIResponse<Order[]> }>('/order');

    expect(response.status).toBe(200);
    expectTypeOf(response.data.data).toEqualTypeOf<APIResponse<Order[]>>();
  });

  it('should get 1 or no order', async () => {
    const response = await axios.get<{ data: APIResponse<Order[]> }>(
      '/order/6731b8a84b08b93c2df43f96',
    );

    expect(response.status).toBe(200);
    expectTypeOf(response.data.data).toEqualTypeOf<APIResponse<Order[]>>();
  });

  //* Create cases
  it('should create a new order', async () => {
    const response = await axios.post<{ data: APIResponse<Order> }>('/order', {
      tableId: '6731b8a84b08b93c2df43f96',
    });

    expect(response.status).toBe(201);
    expectTypeOf(response.data.data).toEqualTypeOf<APIResponse<Order>>();
  });
});

describe('API defaults (order) [Errors]', () => {
  //* Get cases
  it('should not get a order', async () => {
    const response = await axios.get<Response>(
      '/order/0000a0a00a00a00a0aa00a00',
    );

    expect(response.data.data).toEqual([]);
  });
});
