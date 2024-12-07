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
  assignedBy: string;
}

export interface TransformedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  initials: string;
  active: boolean;
  UserPermissions: {
    permissionId: string;
    code: string;
    description: string;
    assignedBy: string;
  }[]; // Match the mapped structure
}
