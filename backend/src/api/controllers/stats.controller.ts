import { Request, Response } from 'express';

import { IAPIResponse } from '@api-types/general.types';
import * as StatsService from '@services/stats.service';
import { getHttpStatusCode } from '@utils/Utils';

interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}

/**
 * Controller so user's can get theire profile data
 * @async
 * @param {Request} req - The request object
 * @param {Request<Record<string, any>, IAPIResponse, ChangePasswordRequestBody>} res - The response object
 * @returns {*} The response object
 */
export async function getStats(req: Request, res: Response): Promise<void> {
  const response = await StatsService.stats();

  res.status(getHttpStatusCode(response.status)).json(response).end();
}
