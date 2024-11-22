import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { StockItemModel } from "../models/StorageModel";

export function useStock(id?: string | string[]) {
  const [stock, setStock] = useState<StockItemModel[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        if (id === "new") {
          return;
        }
        setIsLoading(true);
        setError(null);
        const endpoint = id ? `/stock?id=${id}` : "/stock";
        const response = await apiClient.get(endpoint);
        console.log(response);

        const updatedStock = Array.isArray(response.data.data)
          ? response.data.data.map((item: StockItemModel) => ({
              ...item,
              quantityToAdd: item.quantityToAdd ?? 0,
            }))
          : [];

        console.log(response.data.data);

        setStock(response.data.data);
      } catch (err: any) {
        console.log(err);

        setError("Failed to load stock");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [id]);

  const createStock = async (newStock: StockItemModel) => {
    try {
      const response = await apiClient.post("/stock", newStock);
      setStock((prevStock) =>
        prevStock ? [...prevStock, response.data] : [response.data]
      );
    } catch (err: any) {
      setError("Failed to create stock");
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
      setError("Failed to update stock");
    }
  };

  return { stock, isLoading, error, createStock, updateStock };
}
