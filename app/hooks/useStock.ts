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
          quantityToAdd: item.quantityToAdd ?? 0,
        }));

        setStock(updatedStock);
      } catch (err: any) {
        setError("Failed to load stock");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [id]);

  const createStock = async (newStock: Stock) => {
    try {
      const response = await apiClient.post("/stock", newStock);
      setStock((prevStock) =>
        prevStock ? [...prevStock, response.data] : [response.data]
      );
    } catch (err: any) {
      setError("Failed to create stock");
    }
  };

  const updateStock = async (updatedStock: Stock[]) => {
    try {
      const payload = { items: updatedStock };
      const response = await apiClient.put(`/stock`, payload);

      if (response.data.status === "Updated") {
        setStock(
          (prevStock) =>
            prevStock?.map((item) =>
              updatedStock.find((updated) => updated.id === item.id)
                ? {
                    ...item,
                    ...updatedStock.find((updated) => updated.id === item.id),
                  }
                : item
            ) ?? null
        );
      }
    } catch (err: any) {
      setError("Failed to update stock");
    }
  };

  return { stock, isLoading, error, createStock, updateStock };
}
