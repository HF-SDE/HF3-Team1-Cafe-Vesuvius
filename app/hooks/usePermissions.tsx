import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { Permission } from "@/models/PermissionModel";

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get("/manage/permission");

        // Map the API response to match the Permission interface
        const mappedPermissions: Permission[] = response.data.data.map(
          (item: any) => ({
            permissionId: item.id, // Map `id` to `permissionId`
            code: item.code,
            description: item.description,
            assignedBy: item.assignedBy,
          })
        );

        setPermissions(mappedPermissions);
        //setPermissions(response.data.data);
      } catch (err: any) {
        setError(err.code || "Failed to load permissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return { permissions, isLoading, error };
}
