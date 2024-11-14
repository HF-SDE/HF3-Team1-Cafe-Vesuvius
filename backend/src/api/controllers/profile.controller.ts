import { Request, Response } from 'express';

import { IAPIResponse } from '@api-types/general.types';
import { User } from '@api-types/user.types';
import * as ProfileService from '@services/profile.service';
import { getHttpStatusCode } from '@utils/Utils';

interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}

/**
 * Controller so user's can change there own password
 * @async
 * @param {Request} req - The request object
 * @param {Request<Record<string, any>, IAPIResponse, ChangePasswordRequestBody>} res - The response object
 * @returns {*} The response object
 */
export async function changePassword(
  req: Request<Record<string, any>, IAPIResponse, ChangePasswordRequestBody>,
  res: Response<IAPIResponse>,
): Promise<void> {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user as User;

  const response = await ProfileService.changePassword(
    id,
    newPassword,
    oldPassword,
  );

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
