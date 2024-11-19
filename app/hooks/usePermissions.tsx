import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

interface Permissions {
  username: string;
  email: string;
  initials: string;
  name: string;
  active: boolean;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permissions | null>(null);
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
        setError("Failed to load permissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return { permissions, isLoading, error };
}
