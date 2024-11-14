import { hash } from 'argon2';

import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { PasswordSchema } from '@schemas/password.schemas';
import { changePasswordSchema } from '@schemas/profile.schemas';

/**
 * Service to change a user's password
 * @param {string} id - The id of the user to change the password for.
 * @param {string} newPassword - The new password for the user.
 * @param {string} oldPassword - The old password for the user.
 * @returns {Promise<APIResponse<undefined>>} A promise that resolves to an object containing the status and message of the password change.
 */
export async function changePassword(
  id: string,
  newPassword: string,
  oldPassword: string,
): Promise<APIResponse<undefined>> {
  try {
    // Validate
    const idValidation = changePasswordSchema.validate({
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
    const passwordValidation = PasswordSchema.validate(newPassword);
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

    // const OldPasswordCorrect = await argon2.(oldPassword);

    if (!exist) {
      return {
        status: Status.InvalidCredentials,
        message: 'Old password is incorrect',
      };
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
      data: undefined,
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}
