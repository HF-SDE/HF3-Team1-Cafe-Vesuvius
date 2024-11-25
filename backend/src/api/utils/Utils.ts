import Joi from 'joi';

import { Status } from '@api-types/general.types';
import { prismaModels } from '@prisma-instance';

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
        status: 'Unauthorized',
        message: 'Unauthorized',
      };
  }
}

interface ISchemaOptions {
  optional?: boolean;
}

/**
 * Returns the schema for a given model
 * @param {prismaModels} schemaName - The name of the schema to return
 * @param {ISchemaOptions} options - The options for the schema
 * @returns {Joi.ObjectSchema} The schema for the given model
 */
export function getSchema(
  schemaName: prismaModels,
  { optional = false }: ISchemaOptions = {},
): Joi.ObjectSchema | undefined {
  // import schema file from schemas folder by schemaName
  try {
    const filePath = `../../../schemas/${schemaName}.schema.ts`;

    const type = optional ? 'optional' : 'default';
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access
    const schema = require(filePath)[type] as Joi.ObjectSchema;

    return schema;
  } catch {
    return undefined;
  }
}

/**
 * Capitalizes the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} The string with the first letter capitalized
 */
export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}