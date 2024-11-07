import { NextFunction, Request, Response } from 'express';

export enum Status {
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  Success = 'Success',
  Failed = 'Failed',
  Found = 'Found',
  NotFound = 'NotFound',
  Created = 'Created',
  CreationFailed = 'CreationFailed',
  Deleted = 'Deleted',
  DeleteFailed = 'DeletionFailed',
  Updated = 'Updated',
  UpdateFailed = 'UpdateFailed',
  MissingDetails = 'MissingDetails',
  InvalidDetails = 'InvalidDetails',
  MissingCredentials = 'MissingCredentials',
  InvalidCredentials = 'InvalidCredentials',
}

export interface APIResponse<T> {
  status: Status;
  message?: string;
  data: T | undefined | null;
}

export interface IAPIResponse {
  status: Status;
  message?: string;
}

export interface IEXRequestUser {
  user?: {
    id?: string;
    initials?: string;
  };
}

export interface ControllerRequest<T = any> extends IEXRequestUser {
  body: T;
  cookies: {
    refreshToken: string;
    accessToken: string;
  };
}

export type ExpressFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;
