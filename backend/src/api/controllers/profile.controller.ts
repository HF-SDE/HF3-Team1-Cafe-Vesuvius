import { Request, Response } from 'express';

import { APIResponse, IAPIResponse } from '@api-types/general.types';
import { User } from '@api-types/user.types';
import { accessToken } from '@services/auth.service';
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
/**
 * Controller so user's can get theire profile data
 * @async
 * @param {Request} req - The request object
 * @param {Request<Record<string, any>, IAPIResponse, ChangePasswordRequestBody>} res - The response object
 * @returns {*} The response object
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res
      .status(400)
      .json({
        status: 'MissingData',
        message: 'Missing authentication',
      })
      .header('Access-Control-Allow-Origin', '*');
    return;
  }

  // Ensure it is a bearer token
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
    res.status(400).json({
      status: 'MissingData',
      message: 'Missing authentication',
    });
    return;
  }
  const token = tokenParts[1];

  //res.status(getHttpStatusCode(response.status)).json(response).end();
  const response = await ProfileService.getProfile(token);

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
