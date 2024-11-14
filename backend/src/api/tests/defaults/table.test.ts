import { AxiosError } from 'axios';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  expectTypeOf,
  it,
} from 'vitest';

import { APIResponse } from '@api-types/general.types';
import { Table } from '@prisma/client';

import { Response, axiosInstance as axios } from './axiosInstance';

describe('API defaults (table)', () => {
  const addedTables: string[] = [];

  beforeAll(async () => {
    //
  });

  afterAll(async () => {
    addedTables.forEach(async (id) => {
      await axios.delete(`/table/${id}`);
    });
  });

  it('should get tables', async () => {
    const response = await axios.get<{ data: APIResponse<Table[]> }>('/table');

    expect(response.status).toBe(200);
    expectTypeOf(response.data.data).toEqualTypeOf<APIResponse<Table[]>>();
  });

  it('should get 1 or no table', async () => {
    const response = await axios.get<{ data: APIResponse<Table[]> }>(
      '/table/6731b8a84b08b93c2df43f96',
    );

    expect(response.status).toBe(200);
    expectTypeOf(response.data.data).toEqualTypeOf<APIResponse<Table[]>>();
  });

  it('should create a new table', async () => {
    const response = await axios.post<{ data: APIResponse<Table> }>('/table', {
      number: 46,
    });

    const {
      data: {
        data: { id },
      },
    }: any = response;

    addedTables.push(id as string);

    expect(response.status).toBe(201);
    expectTypeOf(response.data.data).toEqualTypeOf<APIResponse<Table>>();
  });

  it('should not create a new table if the table number already exists', async () => {
    const promise = axios.post('/table', {
      number: 46,
    });

    void expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'CreationFailed',
      message: 'Record already exists',
    });
  });

  it('should delete a table', async () => {
    const response = await axios.delete(`/table/${addedTables[0]}`);

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

    void expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'DeletionFailed',
      message: 'Record not found',
    });
  });
});
