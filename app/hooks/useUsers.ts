import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { UserProfile } from "../models/userModels";

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

  // Create a new user
  const createUser = async (newUser: UserProfile) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post("/manage/user", newUser);
      setUsers((prevUsers) =>
        prevUsers ? [...prevUsers, response.data.data] : [response.data.data]
      );
      return response.data.data; // Return created user data
    } catch (err: any) {
      setError("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing user
  const updateUser = async (updatedUser: UserProfile) => {
    if (!updatedUser.id) {
      setError("User ID is required for updating");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.put(
        `/manage/user?id=${updatedUser.id}`,
        updatedUser
      );
      setUsers((prevUsers) =>
        prevUsers
          ? prevUsers.map((user) =>
              user.id === updatedUser.id ? response.data.data : user
            )
          : []
      );
      return response.data.data; // Return updated user data
    } catch (err: any) {
      setError("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return { users, isLoading, error, createUser, updateUser };
}
