import { AxiosError } from 'axios';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { APIResponse } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Table } from '@prisma/client';

import { Response, axiosInstance as axios } from './axiosInstance';
import { login, logout } from './util';

describe('API defaults (table)', () => {
  const addedTables: string[] = [];

  beforeAll(login);
  afterAll(logout);

  afterEach(async () => {
    await prisma.table.deleteMany({
      where: { id: { in: addedTables } },
    });
  });

  it('should get tables', async () => {
    const response = await axios.get<{ data: APIResponse<Table[]> }>('/table');

    expect(response.status).toBe(200);
  });

  it('should get 1 or no table', async () => {
    const { id: randomId } = await prisma.table.findFirstOrThrow({});

    const response = await axios.get<{ data: APIResponse<Table[]> }>(
      `/table/${randomId}`,
    );

    expect(response.status).toBe(200);
  });

  it('should create a new table', async () => {
    await prisma.table.deleteMany({ where: { number: 46 } });

    const response = await axios.post<{ data: APIResponse<Table> }>('/table', {
      number: 46,
    });

    expect(response.status).toBe(201);
    expect(response.data).toStrictEqual({
      status: 'Created',
      message: 'Created new table',
    });
  });

  it('should not create a new table if the table number already exists', async () => {
    await prisma.table.upsert({
      where: { number: 46 },
      update: {},
      create: { number: 46 },
    });

    const promise = axios.post('/table', { number: 46 });

    await expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'CreationFailed',
      message: 'Table already exists',
    });
  });

  it('should delete a table', async () => {
    const { id: newTableId } = await prisma.table.upsert({
      where: { number: 46 },
      update: {},
      create: { number: 46 },
    });

    const response = await axios.delete(`/table/${newTableId}`);

    addedTables.shift();

    expect(response.status).toBe(200);
  });

  it('should not get a table', async () => {
    const response = await axios.get<Response>(
      '/table/0000a0a00a00a00a0aa00a00',
    );

    expect(response.data.data).toEqual([]);
  });

  it('should not delete a table', async () => {
    const promise = axios.delete('/table/0000a0a00a00a00a0aa00a00');

    await expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'DeletionFailed',
      message: 'Table not found',
    });
  });
});
