import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';

import { axiosInstance as axios } from './axiosInstance';
import { login, logout } from './util';

describe('API defaults (stock)', () => {
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
});
