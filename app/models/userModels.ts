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
