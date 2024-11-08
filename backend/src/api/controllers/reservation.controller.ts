import { Request, Response } from 'express';

import { Prisma } from '@prisma/client';
import * as ReservationService from '@services/reservation.service';
import { getHttpStatusCode } from '@utils/Utils';

/**
 * Controller to get all reservations
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function getReservations(
  req: Request,
  res: Response,
): Promise<void> {
  const id = (req.query.id || req.params.id) as string | undefined;
  const response = await ReservationService.getReservations(id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to create a reservation
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function createReservation(req: Request, res: Response): Promise<void> {
  const response = await ReservationService.createReservation(
    req.body as Prisma.ReservationCreateInput,
  );

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to update a reservation
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function updateReservation(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const response = await ReservationService.updateReservation(
    id,
    req.body as Prisma.ReservationUpdateInput,
  );

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to delete a reservation
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function deleteReservation(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const response = await ReservationService.deleteReservation(id);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
