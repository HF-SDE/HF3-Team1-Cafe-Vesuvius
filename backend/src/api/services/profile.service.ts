import { hash, verify } from 'argon2';

import { IAPIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import {
  ChangePasswordBase64Schema,
  ChangePasswordSchema,
} from '@schemas/profile.schemas';

/**
 * Service to change a user's password
 * @param {string} id - The id of the user to change the password for.
 * @param {string} newPassword - The new password for the user.
 * @param {string} oldPassword - The old password for the user.
 * @returns {Promise<IAPIResponse>} A promise that resolves to an object containing the status and message of the password change.
 */
export async function changePassword(
  id: string,
  newPassword: string,
  oldPassword: string,
): Promise<IAPIResponse> {
  try {
    // Validate
    const idValidation = ChangePasswordBase64Schema.validate({
      newPassword,
      oldPassword,
    });
    if (idValidation.error) {
      return {
        status: Status.InvalidDetails,
        message: idValidation.error.message,
      };
    }

    // Decode the passwords
    newPassword = Buffer.from(newPassword, 'base64').toString();
    oldPassword = Buffer.from(oldPassword, 'base64').toString();

    // Validate the password
    const passwordValidation = ChangePasswordSchema.validate({
      newPassword,
      oldPassword,
    });
    if (passwordValidation.error) {
      return {
        status: Status.InvalidCredentials,
        message: passwordValidation.error.message,
      };
    }

    // Check is old password is correct
    const exist = await prisma.user.findUnique({
      where: { id },
    });

    if (exist) {
      const OldPasswordCorrect = await verify(exist.password, oldPassword);
      if (!OldPasswordCorrect) {
        return {
          status: Status.Failed,
          message: 'Failed to update password',
        };
      }
    } else {
      new Error('User not found');
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword);

    // Update the user's password in the database
    const updateResult = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    if (!updateResult) {
      return {
        status: Status.UpdateFailed,
        message: 'Failed to update password',
      };
    }

    return {
      status: Status.Success,
      message: 'Password updated successfully',
    };
  } catch {
    return {
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}
