import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { UuidSchema } from '@schemas/general.schemas';

type ReservationResult = any;

/**
 * Service to get all reservations
 * @async
 * @param {string} id - The id of the reservation to get.
 * @returns {Promise<APIResponse<ReservationResult>>} A promise that resolves to an object containing the reservation data, status, and message.
 */
export async function getReservations(
  id?: string,
): Promise<APIResponse<ReservationResult>> {
  const validate = UuidSchema.validate(id);

  if (validate.error) {
    return {
      data: undefined,
      status: Status.Failed,
      message: validate.error.message,
    };
  }

  const where = id ? { id } : undefined;

  const reservations = await prisma.reservation.findMany({
    where,
    include: { Table: true },
  });

  return {
    data: reservations,
    status: Status.Success,
    message: `Found ${reservations.length} reservation(s)`,
  };
}

/**
 * Service to create a reservation
 * @async
 * @param {any} data - The data to create a reservation with.
 * @returns {Promise<APIResponse<ReservationResult>>} A promise that resolves to an object containing the reservation data, status, and message.
 */
export async function createReservation(
  data: Prisma.ReservationCreateInput,
): Promise<APIResponse<ReservationResult>> {
  data.reservationTime = new Date(data.reservationTime);

  const reservation = await prisma.reservation.create({
    data,
  });

  return {
    data: reservation,
    status: Status.Created,
    message: 'Reservation created',
  };
}

/**
 * Service to delete a reservation
 * @async
 * @param {string} id - The id of the reservation to delete.
 * @returns {Promise<APIResponse<ReservationResult>>} A promise that resolves to an object containing the reservation data, status, and message.
 */
export async function deleteReservation(
  id: string,
): Promise<APIResponse<ReservationResult>> {
  const reservation = await prisma.reservation.delete({ where: { id } });

  return {
    data: reservation,
    status: Status.Success,
    message: 'Reservation deleted',
  };
}
