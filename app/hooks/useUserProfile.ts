import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  initials: string;
}

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get("/profile");

        // Demo data
        const demoData = {
          username: "John Doe",
          email: "john.doe@example.com",
          phone: "+123456789",
          initials: "JD",
        };

        setUserProfile(demoData);
      } catch (err: any) {
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { userProfile, isLoading, error };
}
