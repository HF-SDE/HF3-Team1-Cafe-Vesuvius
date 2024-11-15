import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

interface UserProfile {
  username: string;
  email: string;
  initials: string;
  name: string;
}

export function useUsers() {
  const [users, setUsers] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get("/manage/user");

        setUsers(response.data.data);
      } catch (err: any) {
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, isLoading, error };
}
