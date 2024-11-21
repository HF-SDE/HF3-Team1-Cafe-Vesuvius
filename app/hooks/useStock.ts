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

  // Create a new stock item
  const createStock = async (newStock: Stoc) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post("/stock", newStock);
      // Optionally add the new stock item to the current stock list
      setStock((prevStock) =>
        prevStock ? [...prevStock, response.data] : [response.data]
      );
    } catch (err: any) {
      setError("Failed to create stock");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing stock item
  const updateStock = async (updatedStock: Stock[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const payload = { items: updatedStock };

      const response = await apiClient.put(`/stock`, payload);

      // Update the stock list with the updated item
      if (response.data.status === "Updated") {
        // Update the stock list with the updated stock items
        setStock((prevStock) => {
          if (!prevStock) return updatedStock; // If stock is null, just return the updated stock

          // Map through the current stock and update the modified items
          return prevStock.map((item) => {
            // Find if this item exists in the updatedStock array
            const updatedItem = updatedStock.find(
              (updated) => updated.id === item.id
            );
            if (updatedItem) {
              // Merge the updated fields into the existing item (you can choose to update only specific fields)
              return { ...item, ...updatedItem };
            }
            // If no update for this item, return the original item
            return item;
          });
        });
      } else {
        setError("Failed to update stock");
      }
    } catch (err: any) {
      setError("Failed to update stock");
    } finally {
      setIsLoading(false);
    }
  };

  return { stock, isLoading, error, createStock, updateStock };
}
