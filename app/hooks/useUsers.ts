import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  initials: string;
  name: string;
  permissions: Permission[];
}
interface Permission {
  code: string;
  description: string;
}
export function useUsers(id?: string | string[]) {
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const test = "673aeeb3fbd2517ae3ab94f3";

        const endpoint = id ? `/manage/user?id=${id}` : "/manage/user";
        const response = await apiClient.get(endpoint);
        //const response = await apiClient.get("/manage/user");

        setUsers(response.data.data);
      } catch (err: any) {
        setError("Failed to load user/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [id]);

  return { users, isLoading, error };
}
