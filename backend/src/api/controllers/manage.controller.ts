import { Request, Response } from 'express';

import { APIResponse, TypedQuery } from '@api-types/general.types';
import { User } from '@api-types/user.types';
import { Prisma } from '@prisma/client';
import * as ManageService from '@services/manage.service';
import { getHttpStatusCode } from '@utils/Utils';

/**
 * Controller to get all users
 * @async
 * @param {Request<Record<string, any>, APIResponse<Prisma.UserUpdateManyMutationInput[], Record<string, any>, TypedQuery<User>>>} req - The request object
 * @param {Response<APIResponse<Prisma.UserUpdateManyMutationInput[]>>} res - The response object
 * @returns {*} The response object
 */
export async function getUsers(
  req: Request<
    Record<string, any>,
    APIResponse<Prisma.UserUpdateManyMutationInput[]>,
    Record<string, any>,
    TypedQuery<User>
  >,
  res: Response<APIResponse<Prisma.UserUpdateManyMutationInput[]>>,
): Promise<void> {
  const { id, username, email } = req.query;
  const response = await ManageService.getUsers(id, username, email);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
