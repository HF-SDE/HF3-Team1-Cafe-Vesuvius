import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { UserProfile } from "../models/userModels";

export function useUsers(id?: string | string[]) {
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (id === "new") {
        return;
      }

      const endpoint = id ? `/manage/user?id=${id}` : "/manage/user";
      const response = await apiClient.get(endpoint);
      //const response = await apiClient.get("/manage/user");

      setUsers(response.data.data);
    } catch (err: any) {
      setError(err.code || "Failed to load user/users");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [id]);

  const refreshUsers = async () => {
    await fetchUsers();
  };

  // Create a new user
  const createUser = async (newUser: UserProfile) => {
    try {
      setIsLoading(true);
      setError(null);

      const { id, ...userWithoutId } = newUser;

      const response = await apiClient.post("/manage/user", userWithoutId);
      setUsers((prevUsers) =>
        prevUsers ? [...prevUsers, response.data.data] : [response.data.data]
      );
      return response.data.data; // Return created user data
    } catch (err: any) {
      setError(err.code || "Failed to create user");
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

      const { id, ...userWithoutId } = updatedUser;

      const response = await apiClient.patch(
        `/manage/user/${id}`,
        userWithoutId
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
      setError(err.code || "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return { users, isLoading, error, createUser, updateUser, refreshUsers };
}
