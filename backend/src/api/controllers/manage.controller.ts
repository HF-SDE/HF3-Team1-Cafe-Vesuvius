import { Request, Response } from 'express';

import { APIResponse, IAPIResponse } from '@api-types/general.types';
import { User } from '@api-types/user.types';
import { Prisma } from '@prisma/client';
import * as ManageService from '@services/manage.service';
import { getHttpStatusCode } from '@utils/Utils';

interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}

/**
 * Controller to change the user's password
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

  // Validate

  const response = await ManageService.changePassword(
    id,
    oldPassword,
    newPassword,
  );

  res.status(getHttpStatusCode(response.status)).json(response).end();
}

/**
 * Controller to get all users
 * @async
 * @param {Request<Record<string, any>, APIResponse<Prisma.UserUpdateManyMutationInput[]>>} req - The request object
 * @param {Response<APIResponse<Prisma.UserUpdateManyMutationInput[]>>} res - The response object
 * @returns {*} The response object
 */
export async function getUsers(
  req: Request<
    Record<string, any>,
    APIResponse<Prisma.UserUpdateManyMutationInput[]>,
    Record<string, any>,
    User
  >,
  res: Response<APIResponse<Prisma.UserUpdateManyMutationInput[]>>,
): Promise<void> {
  const { id, username, email } = req.query;
  const response = await ManageService.getUsers(id, username, email);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
