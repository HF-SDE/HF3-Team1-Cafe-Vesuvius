import { Request, Response } from 'express';

import { APIResponse } from '@api-types/general.types';
import { StatsResponse } from '@api-types/stats.types';
import * as StatsService from '@services/stats.service';
import { getHttpStatusCode } from '@utils/Utils';

interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}

// eslint-disable-next-line no-secrets/no-secrets
/**
 * Controller so user's can get their profile data
 * @async
 * @param {Request<Record<string, any>, APIResponse<StatsResponse>, ChangePasswordRequestBody>} req - The request object
 * @param {Response<APIResponse<StatsResponse>>} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function getStats(
  req: Request<
    Record<string, any>,
    APIResponse<StatsResponse>,
    ChangePasswordRequestBody
  >,
  res: Response<APIResponse<StatsResponse>>,
): Promise<void> {
  const response = await StatsService.stats();

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
