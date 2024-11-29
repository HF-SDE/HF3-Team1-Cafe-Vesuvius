import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { Table } from "@/models/TableModels";

export function useTable() {
  const [table, setTable] = useState<Table[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservations() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get("/table", {
          validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
        });

        setTable(response.data.data);
      } catch (err: unknown) {
        setError("Failed to load reservation data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return { table: table, isLoading, error };
}
