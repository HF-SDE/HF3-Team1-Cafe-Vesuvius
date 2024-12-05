import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

interface Permissions {
  code: string;
  description: string;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permissions[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get("/manage/permission");

        setPermissions(response.data.data);
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
