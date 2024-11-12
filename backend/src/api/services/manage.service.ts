import * as argon2 from 'argon2';

import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { UuidSchema } from '@schemas/general.schemas';
import { PasswordSchema } from '@schemas/password.schemas';

/**
 * Service to change a user's password
 * @async
 * @param {string} id - The id of the user to change the password for.
 * @param {string} newPassword - The new password for the user.
 * @returns {Promise<APIResponse<null>>} A promise that resolves to an object containing the status and message of the password change.
 */
export async function changePassword(
  id: string,
  newPassword: string,
): Promise<APIResponse<null>> {
  try {
    // Validate the user ID
    const idValidation = UuidSchema.validate(id);
    if (idValidation.error) {
      return {
        data: undefined,
        status: Status.Failed,
        message: idValidation.error.message,
      };
    }

    // Validate the new password using Joi schema
    const passwordValidation = PasswordSchema.validate(newPassword);
    if (passwordValidation.error) {
      return {
        data: undefined,
        status: Status.Failed,
        message: passwordValidation.error.details[0].message, // Return the first validation error
      };
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update the user's password in the database
    const updateResult = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    if (!updateResult) {
      return {
        data: undefined,
        status: Status.NotFound,
        message: 'User not found',
      };
    }

    return {
      data: undefined,
      status: Status.Success,
      message: 'Password updated successfully',
    };
  } catch {
    return {
      data: undefined,
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}
