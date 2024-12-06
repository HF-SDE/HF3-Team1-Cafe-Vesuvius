import { Permission } from './permission.types';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  initials: string;
  active: boolean;
  UserPermissions?: UserPermission[];
}

interface UserPermission {
  Permission: Permission;
}

export interface TransformedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  initials: string;
  active: boolean;
  permissions: { code: string; description: string }[]; // Match the mapped structure
}
