import { APIResponse, Status } from '@api-types/general.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { getUserSchema } from '@schemas/user.schemas';


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
      const validation = getUserSchema.validate({ id, username, email });
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
