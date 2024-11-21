import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { Stock } from "../models/StorageModel";

export function useStock(id?: string | string[]) {
  const [stock, setStock] = useState<Stock[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const endpoint = id ? `/stock?id=${id}` : "/stock";
        const response = await apiClient.get(endpoint);

        const updatedStock = response.data.data.map((item: Stock) => ({
          ...item,
          quantityToAdd: item.quantityToAdd ?? 1,
        }));

        setStock(response.data.data);
      } catch (err: any) {
        setError("Failed to load stock");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [id]);

  return { stock, isLoading, error };
}
