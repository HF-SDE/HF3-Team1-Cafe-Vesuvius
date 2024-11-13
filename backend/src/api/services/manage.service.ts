import * as argon2 from 'argon2';

import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { UuidSchema } from '@schemas/general.schemas';
import { PasswordSchema } from '@schemas/password.schemas';
import { getUser } from '@schemas/user.schemas';

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

/**
 * Service to get all users
 * @async
 * @param {string} id - The id of the user to get.
 * @param {string} username - The username of the user to get.
 * @param {string} email - The email of the user to get.
 * @returns {Promise<APIResponse<Prisma.UserUpdateManyMutationInput[]>>} A promise that resolves to an object containing the status and message of the user retrieval.
 */
export async function getUsers(
  id?: string,
  username?: string,
  email?: string,
): Promise<APIResponse<Prisma.UserUpdateManyMutationInput[]>> {
  try {
    // Validate the user
    if (id || username || email) {
      const validation = getUser.validate({ id, username, email });
      if (validation.error) {
        return {
          status: Status.InvalidDetails,
          message: validation.error.message,
        };
      }
    }


    // Get all users
    const users = await prisma.user.findMany({
      where: {
        id,
        username,
        email,
      },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      include: {
        UserPermissions: {
          select: {
            Permission: {
              select: {
                code: true,
                description: true,
              },
            },
          },
        },
      },
    });

    let result: Prisma.UserUpdateManyMutationInput[] = [];
    if (users.length === 0) {
      return {
        status: Status.NotFound,
        message: 'User(s) not found',
      };
    } else {
      // Manually mapping
      result = users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          initials: user.initials,
          active: user.active,
          permissions: user.UserPermissions.map((permission) => {
            return {
              code: permission.Permission.code,
              description: permission.Permission.description,
            };
          }),
        };
      });
    }

    return {
      data: result,
      status: Status.Found,
      message: 'User(s) found',
    };
  } catch {
    return {
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}
