import { AxiosError } from 'axios';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { APIResponse } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Table } from '@prisma/client';

import { Response, axiosInstance as axios } from './axiosInstance';
import TestCases from './generateTest';
import { login, logout } from './util';

describe('API defaults (table)', () => {
  const testCases = new TestCases<Table>('/table', {
    getAll: 'Table(s) found',
    create: 'Created new table',
  });

  beforeAll(login);
  afterAll(logout);

  describe('Get cases', async () => {
    const { id: randomId } = await prisma.table.findFirstOrThrow({});

    it('Get all tables', testCases.getAllTest());
    it('Get 1 or no table', testCases.getOneTest(randomId));
  });

  describe('Create cases', async () => {
    await prisma.table.deleteMany({ where: { number: 46 } });

    const createBody = { number: 46 };
    it('Create a new table', testCases.createTest(createBody));
  });

  describe('Delete cases', async () => {
    it('Delete a table', async () => {
      const { id: newTableId } = await prisma.table.upsert({
        where: { number: 46 },
        update: {},
        create: { number: 46 },
      });

      const response = await axios.delete(`/table/${newTableId}`);

      expect(response.status).toBe(200);
    });
  });

  describe('Errors', () => {
    it('should not get a table', async () => {
      const response = await axios.get<Response>(
        '/table/0000a0a00a00a00a0aa00a00',
      );

      expect(response.data.data).toEqual([]);
    });

    it('should not create a new table if the table number already exists', async () => {
      await prisma.table.upsert({
        where: { number: 46 },
        update: {},
        create: { number: 46 },
      });

      const response = await axios.post('/table', { number: 46 });

      expect(response?.data).toStrictEqual({
        status: 'CreationFailed',
        message: 'Table already exists',
      });
    });

    it('should not delete a table', async () => {
      const response = await axios.delete('/table/0000a0a00a00a00a0aa00a00');

      expect(response?.data).toStrictEqual({
        status: 'DeletionFailed',
        message: 'Table not found',
      });
    });
  });
});
