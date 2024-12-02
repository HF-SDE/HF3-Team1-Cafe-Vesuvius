import { AxiosError } from 'axios';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';

import { axiosInstance as axios } from './axiosInstance';
import { createRandomString, login, logout } from './util';

describe('API (Get stock)', () => {
  beforeAll(login);
  afterAll(logout);

  //* Get cases
  it('should get stock', async () => {
    const response = await axios.get<{
      data: APIResponse<Prisma.RawMaterialCreateInput[]>;
    }>('/stock');

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.arrayContaining([]),
      status: Status.Found,
      message: 'Stocks item(s) found',
    });
  });

  it('should get stock by id and fail with error code 400', async () => {
    await axios.get('/stock?id=1').catch((error: AxiosError) => {
      expect(error.status).toBe(400);
      expect(error.response?.data).toEqual({
        message: '(1) must be a valid ObjectId',
        status: Status.InvalidDetails,
      });
    });
  });

  it('should get stock [Not found]', async () => {
    await axios
      .get<Response>('/stock?id=0000a0a00a00a00a0aa00a00')
      .catch((error: AxiosError) => {
        expect(error.status).toBe(404);
        expect(error.response?.data).toEqual({
          status: Status.NotFound,
          message: 'Stocks item(s) not found',
        });
      });
  });
});

describe('API (Create stock)', () => {
  beforeAll(login);
  afterAll(logout);

  //* Create cases
  it('should create stock', async () => {
    const name = createRandomString(10);

    const response = await axios.post<{
      data: APIResponse<Prisma.RawMaterialCreateInput>;
    }>('/stock', {
      name,
      quantity: 10,
      unit: 'kg',
    });

    expect(response.status).toBe(201);
    expect(response.data).toEqual({
      status: Status.Created,
      message: 'Add new material to stock',
    });

    // Integration test
    const created = await prisma.rawMaterial.findUnique({
      where: {
        name,
      },
    });

    expect(created).not.toBeNull();
  });

  it('should fail to create stock with error code 400', async () => {
    await axios
      .post('/stock', {
        name: 'Test stock',
        quantity: 10,
      })
      .catch((error: AxiosError) => {
        expect(error.status).toBe(400);
        expect(error.response?.data).toEqual({
          status: Status.InvalidDetails,
          message: '"unit" is required',
        });
      });
  });
});

describe('API (Update stock)', () => {
  beforeAll(login);
  afterAll(logout);

  it('should update stock', async () => {
    const data = await prisma.rawMaterial.findFirst();
    const name = createRandomString(10);

    const response = await axios.put<{
      data: APIResponse<Prisma.RawMaterialUpdateManyMutationInput>;
    }>('/stock', {
      items: [
        {
          id: data?.id,
          quantity: 10,
          unit: 'kg',
          name,
        },
      ],
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: Status.Updated,
      message: 'Item(s) updated',
    });

    // Integration test
    const updated = await prisma.rawMaterial.findUnique({
      where: {
        name,
      },
    });

    expect(updated).not.toBeNull();
  });

  it('should fail to update stock with error code 400', async () => {
    await axios
      .put('/stock', {
        items: [
          {
            quantity: 10,
            unit: 'kg',
          },
        ],
      })
      .catch((error: AxiosError) => {
        expect(error.status).toBe(400);
        expect(error.response?.data).toEqual({
          status: Status.InvalidDetails,
          message: '"[0].id" is required',
        });
      });
  });
});
