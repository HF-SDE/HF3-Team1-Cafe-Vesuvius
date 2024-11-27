/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AxiosError } from 'axios';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { APIResponse } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Reservation } from '@prisma/client';

import { Response, axiosInstance as axios } from './axiosInstance';
import { login, logout } from './util';

/**
 * @param {string[]} cleanupList - List of reservation IDs to clean up
 * @param {number} amount - The amount of reservations to create
 * @returns {Promise<Reservation>} A new reservation
 */
async function dummyReservation(
  cleanupList: string[],
  amount: number = 1,
): Promise<Reservation> {
  const newReservation = await prisma.reservation.create({
    data: {
      amount,
      name: 'John Doe',
      reservationTime: new Date('2025-01-01T12:00:00.000Z'),
      tableIds: await randomTableIds(amount / 2),
    },
  });

  cleanupList.push(newReservation.id);

  return newReservation;
}

/**
 * @param {number} amount - The amount of tables to get
 * @returns {Promise<string[]>} A random table ID
 */
async function randomTableIds(amount: number = 1): Promise<string[]> {
  const randomTables = await prisma.table.findMany({
    where: { Reservations: { none: {} } },
    take: amount,
  });

  return randomTables.map((table) => table.id);
}

describe('API defaults (reservations)', () => {
  const addedReservations: string[] = [];

  beforeAll(login);
  afterAll(logout);

  afterEach(async () => {
    await prisma.reservation.deleteMany({
      where: { id: { in: addedReservations } },
    });
  });

  //* Get cases
  it('should get reservations', async () => {
    const response = await axios.get<{ data: APIResponse<Reservation[]> }>(
      '/reservation',
    );

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      data: expect.arrayContaining([]),
      status: 'Found',
      message: 'Reservation(s) found',
    });
  });

  it('should get 1 or no reservation', async () => {
    const newReservation = await dummyReservation(addedReservations);

    const response = await axios.get<{ data: APIResponse<Reservation[]> }>(
      `/reservation/${newReservation.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      data: expect.arrayContaining([]),
      status: 'Found',
      message: 'Reservation(s) found',
    });
  });

  //* Create cases
  it('should create a new reservation in the future', async () => {
    const response = await axios.post<unknown>('/reservation', {
      amount: 1,
      name: 'John Doe',
      email: 'johndoe@email.com',
      tableIds: await randomTableIds(),
      reservationTime: '2025-01-01T12:00:00.000Z',
    });

    expect(response.status).toBe(201);
    expect(response.data).toStrictEqual({
      status: 'Created',
      message: 'Created new reservation',
    });
  });

  it('should create a new reservation right now', async () => {
    const response = await axios.post<unknown>('/reservation', {
      amount: 1,
      name: 'John Doe',
      email: 'johndoe@email.com',
      tableIds: await randomTableIds(),
      reservationTime: new Date(),
    });

    expect(response.status).toBe(201);
    expect(response.data).toStrictEqual({
      status: 'Created',
      message: 'Created new reservation',
    });
  });

  //* Update cases
  it('should update a reservation', async () => {
    const newReservation = await dummyReservation(addedReservations);

    const response = await axios.put(`/reservation/${newReservation.id}`, {
      amount: 2,
      name: 'Jane Doe',
      reservationTime: '2025-02-01T14:00:00.000Z',
    });

    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual({
      status: 'Updated',
      message: 'Updated reservation',
    });
  });

  //* Delete cases
  it('should delete a reservation', async () => {
    const newReservation = await prisma.reservation.create({
      data: {
        amount: 1,
        name: 'John Doe',
        reservationTime: new Date('2025-01-01T12:00:00.000Z'),
        tableIds: await randomTableIds(),
      },
    });

    const response = await axios.delete(`/reservation/${newReservation.id}`);

    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual({
      status: 'Deleted',
      message: 'Deleted reservation',
    });
  });
});

describe('API defaults (reservations) [Errors]', () => {
  const addedReservations: string[] = [];

  beforeAll(login);
  afterAll(logout);

  beforeAll(async () => {
    await dummyReservation(addedReservations);
  });

  afterAll(async () => {
    await prisma.reservation.deleteMany({
      where: { id: { in: addedReservations } },
    });
  });

  //* Get cases
  it('should not get a reservation [Not found]', async () => {
    const response = await axios.get<Response>(
      '/reservation/0000a0a00a00a00a0aa00a00',
    );

    expect(response.data.data).toEqual([]);
  });

  //* Update cases
  it('should not update a reservation [Not found]', async () => {
    const promise = axios.put('/reservation/0000a0a00a00a00a0aa00a00', {
      amount: 2,
      name: 'Jane Doe',
      reservationTime: '2025-02-01T14:00:00.000Z',
    });

    await expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'UpdateFailed',
      message: 'Reservation not found',
    });
  });

  it('should not update a reservation [Invalid input]', async () => {
    const promise = axios.put(`/reservation/${addedReservations[0]}`, {
      amount: 0,
      name: 'Jane Doe',
      reservationTime: 'tomorrow',
    });

    await expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'InvalidDetails',
      message:
        '(reservationTime) must be a valid date. (amount) must be a positive number',
    });
  });

  //* Delete cases
  it('should not delete a reservation [Not found]', async () => {
    const promise = axios.delete('/reservation/0000a0a00a00a00a0aa00a00');

    await expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'DeletionFailed',
      message: 'Reservation not found',
    });
  });
});
