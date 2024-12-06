import { TransformedUser, User } from '@api-types/user.types';

/**
 * Transforms raw User data into TransformedUser format.
 * @param data - Array of raw User objects
 * @returns Array of TransformedUser objects
 */
export function transformUserData(data: User[]): TransformedUser[] {
  return data.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    initials: user.initials,
    active: user.active,
    UserPermissions:
      user.UserPermissions?.map((permission) => ({
        id: permission.Permission.id,
        code: permission.Permission.code,
        description: permission.Permission.description,
      })) || [],
  }));
}
