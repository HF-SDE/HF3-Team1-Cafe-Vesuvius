export interface UserProfile {
  id: string;
  username: string;
  email: string;
  initials: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  code: string;
  description: string;
}

export interface Menu {
  id: string;
  category: string[];
  name: string;
  price: number;
}
