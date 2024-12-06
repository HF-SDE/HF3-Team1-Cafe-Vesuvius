export interface UserProfile {
  id: string;
  username: string;
  email: string;
  initials: string;
  name: string;
  active: boolean;
  UserPermissions: Permission[];
}

export interface Permission {
  code: string;
  description: string;
}
