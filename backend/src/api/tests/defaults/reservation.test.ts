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
import { Reservation } from '@prisma/client';

import { Response, axiosInstance as axios } from './axiosInstance';

describe('API defaults (reservations)', () => {
  const addedReservations: string[] = [];

  afterAll(() => {
    addedReservations.forEach(async (id) => {
      await axios.delete(`/reservation/${id}`);
    });
  });

  //* Get cases
  it('should get reservations', async () => {
    const response = await axios.get<{ data: APIResponse<Reservation[]> }>(
      '/reservation',
    );

    expect(response.status).toBe(200);
    expectTypeOf(response.data.data).toEqualTypeOf<
      APIResponse<Reservation[]>
    >();
  });

  it('should get 1 or no reservation', async () => {
    const response = await axios.get<{ data: APIResponse<Reservation[]> }>(
      '/reservation/6731b8a84b08b93c2df43f96',
    );

    expect(response.status).toBe(200);
    expectTypeOf(response.data.data).toEqualTypeOf<
      APIResponse<Reservation[]>
    >();
  });

  //* Create cases
  it('should create a new reservation', async () => {
    const response = await axios.post<unknown>('/reservation', {
      amount: 1,
      name: 'John Doe',
      tableIds: ['6731b8a84b08b93c2df43f96'],
      reservationTime: '2022-01-01T12:00:00.000Z',
    });

    const {
      data: {
        data: { id },
      },
    }: any = response;

    addedReservations.push(id as string);

    expect(response.status).toBe(201);
  });

  //* Update cases
  it('should update a reservation', async () => {
    const response = await axios.put(`/reservation/${addedReservations[0]}`, {
      amount: 2,
      name: 'Jane Doe',
      reservationTime: '2022-02-01T14:00:00.000Z',
    });

    expect(response.status).toBe(200);
  });

  //* Delete cases
  it('should delete a reservation', async () => {
    const response = await axios.delete(`/reservation/${addedReservations[0]}`);

    addedReservations.shift();

    expect(response.status).toBe(200);
  });
});

describe('API defaults (reservations) [Errors]', () => {
  const addedReservations: string[] = [];

  beforeAll(async () => {
    const response = await axios.post<unknown>('/reservation', {
      amount: 1,
      name: 'John Doe',
      tableIds: ['6731b8a84b08b93c2df43f96'],
      reservationTime: '2022-01-01T12:00:00.000Z',
    });

    const {
      data: {
        data: { id },
      },
    }: any = response;

    addedReservations.push(id as string);
  });

  afterAll(() => {
    addedReservations.forEach(async (id) => {
      await axios.delete(`/reservation/${id}`);
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
      reservationTime: '2022-02-01T14:00:00.000Z',
    });

    void expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'UpdateFailed',
      message: 'Record not found',
    });
  });

  it('should not update a reservation [Invalid input]', async () => {
    const promise = axios.put(`/reservation/${addedReservations[0]}`, {
      amount: 0,
      name: 'Jane Doe',
      reservationTime: 'invalid date string',
    });

    void expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'MissingDetails',
      message: 'Invalid input',
    });
  });

  //* Delete cases
  it('should not delete a reservation [Not found]', async () => {
    const promise = axios.delete('/reservation/0000a0a00a00a00a0aa00a00');

    void expect(promise).rejects.toThrow();

    const response = await promise.catch((error: AxiosError) => error.response);

    expect(response?.data).toStrictEqual({
      status: 'DeletionFailed',
      message: 'Record not found',
    });
  });
});
