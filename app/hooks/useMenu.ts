import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { Menu } from "../models/userModels";

export function useMenu(id?: string | string[]) {
  const [menu, setMenu] = useState<Menu[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const endpoint = id ? `/menu?id=${id}` : "/menu";
        const response = await apiClient.get(endpoint);

        setMenu(response.data.data);
      } catch (err: any) {
        setError("Failed to load menu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  return { menu, isLoading, error };
}
