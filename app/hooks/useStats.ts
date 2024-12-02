import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { UserProfile } from "../models/userModels";

export function useStats() {
  const [stats, setStats] = useState<UserProfile[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get("/stats");
      //const response = await apiClient.get("/manage/user");

      setStats(response.data.data);
    } catch (err: any) {
      setError("Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);

  const refreshStats = async () => {
    await fetchStats();
  };

  return { stats, isLoading, error, refreshStats };
}
