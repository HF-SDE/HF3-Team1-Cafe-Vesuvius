import { Request, Response } from 'express';

import * as ManageService from '@services/manage.service';
import { getHttpStatusCode } from '@utils/Utils';

interface ChangePasswordRequestBody {
  id: string;
  newPassword: string;
}

/**
 * Controller to change the user's password
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {*} The response object
 */
export async function changePassword(
  req: Request<
    Record<string, any>,
    Record<string, any>,
    ChangePasswordRequestBody
  >,
  res: Response,
): Promise<void> {
  const { id, newPassword } = req.body;

  // Validate that id and newPassword are strings
  if (typeof id !== 'string' || typeof newPassword !== 'string') {
    res
      .status(400)
      .json({
        status: 'Failed',
        message: 'Invalid input: `id` and `newPassword` must be strings.',
      })
      .end();
    return;
  }

  const response = await ManageService.changePassword(id, newPassword);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
