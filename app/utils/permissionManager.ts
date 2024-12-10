import { getStorageItemAsync } from "../hooks/useStorageState";

// utils/PermissionManager.ts
export class PermissionManager {
  private permissions: string[] = [];
  private pages: string[] = [];

  // Map of permissions to multiple pages
  private permissionsToPages: { [key: string]: string[] } = {
    "administrator:stats:view": ["ManagementPage", "StatsPage"],
    "administrator:users:view": ["ManagementPage", "UsersPage"],
    "administrator:users:update": ["ManagementPage", "UsersPage"],
    "administrator:users:create": ["ManagementPage", "UsersPage"],
    "administrator:users:management": ["ManagementPage", "UsersPage"],
    "administrator:permission:create": ["ManagementPage", "PermissionPage"],
    "administrator:permission:view": ["ManagementPage", "PermissionPage"],
    "administrator:permissiongroup:create": [
      "ManagementPage",
      "PermissionGroupPage",
    ],
    "order:view": ["OrderPage"],
    "order:create": ["OrderPage", "OrderCreatePage"],
    "order:status:update:completed": ["OrderPage"],
    "order:status:update:deliver": ["OrderPage"],
    "menu:view": ["MenuPage"],
    "menu:update": ["MenuPage"],
    "menu:create": ["MenuPage"],
    "menu:delete": ["MenuPage"],
    "stock:view": ["ManagementPage", "StockPage"],
    "stock:update": ["ManagementPage", "StockPage"],
    "stock:create": ["v", "StockPage"],
    "table:view": ["TablePage"],
    "table:create": ["TablePage"],
    "table:delete": ["TablePage"],
    "reservation:view": ["ReservationPage"],
    "reservation:update": ["ReservationPage"],
    "reservation:create": ["ReservationPage", "ReservationCreatePage"],
    "reservation:delete": ["ReservationPage"],
  };

  // Helper function to decode the JWT token
  private decodeJwt(token: string): any {
    const payload = token.split(".")[1]; // Get the payload part (second part of the JWT)
    const decodedPayload = atob(payload); // Decode base64 URL encoded string
    return JSON.parse(decodedPayload); // Parse the decoded JSON string
  }

  // Async method to get permissions
  private async getPermissions(): Promise<string[]> {
    const token: string | null = await getStorageItemAsync("token");

    if (!token) {
      return []; // If no token is available, return an empty array
    }

    // Decode the token and extract permissions
    const decoded = this.decodeJwt(token);
    return decoded.permissions || []; // Return permissions or an empty array if not found
  }

  // Initialize method to load permissions asynchronously
  public async init(): Promise<void> {
    this.permissions = await this.getPermissions();
    this.pages = await this.getAccessiblePages();
  }

  // Method to check if the user has a particular permission
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  // Method to check if the user has at least one of the permissions from a list
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) =>
      this.permissions.includes(permission)
    );
  }

  // Method to check if the user has all of the permissions from a list
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) =>
      this.permissions.includes(permission)
    );
  }

  // Method to check if the user has access to a specific page
  hasPageAccess(page: string): boolean {
    return this.pages.includes(page);
  }

  // Method to get the list of pages the user can access
  public getAccessiblePages(): string[] {
    // Loop through the permissions and collect all pages the user has access to
    let accessiblePages: string[] = ["ProfilePage"];
    Object.keys(this.permissionsToPages).forEach((permission) => {
      if (this.permissions.includes(permission)) {
        // Add all pages associated with this permission
        accessiblePages = [
          ...accessiblePages,
          ...this.permissionsToPages[permission],
        ];
      }
    });

    // Remove duplicates (in case a user has multiple permissions for the same page)
    return [...new Set(accessiblePages)];
  }
}

// Example usage: Initialize with a list of permissions
export const permissionManager = new PermissionManager();

// To initialize the permissions asynchronously
async function initializePermissions() {
  await permissionManager.init();
}
