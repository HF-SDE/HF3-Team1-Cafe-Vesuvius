import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { StockItemModel } from "../models/StorageModel";

export function useStock(id?: string | string[]) {
  const [stock, setStock] = useState<StockItemModel[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = async () => {
    try {
      if (id === "new") {
        return;
      }
      setIsLoading(true);
      setError(null);
      const endpoint = id ? `/stock?id=${id}` : "/stock";
      const response = await apiClient.get(endpoint);

      setStock(response.data.data);
    } catch (err: any) {
      console.log(err);

      setError(err.code || "Failed to load stock");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [id]);

  const createStock = async (newStock: StockItemModel) => {
    try {
      const response = await apiClient.post("/stock", newStock);
      if (response.status === 201) {
        await fetchStock();
      }
    } catch (err: any) {
      setError(err.code || "Failed to create stock");
    }
  };

  const updateStock = async (
    updatedStock: StockItemModel[] | StockItemModel
  ) => {
    try {
      if (!Array.isArray(updatedStock)) {
        updatedStock = [updatedStock];
      }
      const payload = { items: updatedStock };
      const response = await apiClient.put(`/stock`, payload);

      if (response.status === 200) {
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
      setError(err.code || "Failed to update stock");
    }
  };
  const deleteStock = async (deleteStock: StockItemModel) => {
    try {
      // const response = await apiClient.delete("/stock", deleteStock);
      // if (response.status === 201) {
      //   await fetchStock();
      // }
      setStock(
        (prevStock) =>
          prevStock?.filter((item) => item.id !== deleteStock.id) ?? null
      );
    } catch (err: any) {
      setError(err.code || "Failed to delete stock");
    }
  };

  return { stock, isLoading, error, createStock, updateStock, deleteStock };
}
