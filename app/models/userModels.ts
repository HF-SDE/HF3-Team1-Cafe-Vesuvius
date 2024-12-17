import { Permission } from "@/models/PermissionModel";
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  initials: string;
  name: string;
  active: boolean;
  password: string;
  UserPermissions: Permission[];
}
export interface UserInfo {
  id: string; // The user ID extracted from the token
  [key: string]: any; // Any other properties in the token payload
}
