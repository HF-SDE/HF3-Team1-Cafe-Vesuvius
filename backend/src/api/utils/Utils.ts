import { Status } from '@api-types/general.types';

/**
 * Returns the HTTP status code for a given Status
 * This allows for easy and quick conversion between the Status enum and HTTP status codes
 * @param {Status} status - The Status enum to convert to an HTTP status code
 * @returns {number} The HTTP status code for the given Status
 */
export function getHttpStatusCode(status: Status): number {
  switch (status) {
    case Status.Unauthorized:
      return 401;
    case Status.Forbidden:
      return 403;
    case Status.Success:
      return 200;
    case Status.Failed:
      return 500;
    case Status.Found:
      return 200;
    case Status.NotFound:
      return 404;
    case Status.Created:
      return 201;
    case Status.CreationFailed:
      return 400;
    case Status.Deleted:
      return 200;
    case Status.DeleteFailed:
      return 404;
    case Status.Updated:
      return 200;
    case Status.UpdateFailed:
      return 404;
    case Status.MissingDetails:
      return 400;
    case Status.InvalidDetails:
      return 400;
    case Status.MissingCredentials:
      return 400;
    case Status.InvalidCredentials:
      return 401;
    case Status.TooManyRequests:
      return 429;
    case Status.WSSuccess:
      return 1000;
    case Status.WSUnauthorized:
      return 1008;
    case Status.WSForbidden:
      return 1013;
    case Status.WSFailed:
      return 1011;
  }
}

// eslint-disable-next-line jsdoc/require-returns
/**
 *
 * @param {number} code - Response code
 */
export function defaultResponse(code: number | string) {
  switch (code) {
    case Status.Unauthorized:
    case getHttpStatusCode(Status.Unauthorized):
      return {
        stats: 'Unauthorized',
        message: 'Unauthorized',
      };
  }
}
