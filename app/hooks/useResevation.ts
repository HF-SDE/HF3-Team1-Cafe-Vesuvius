import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { Reservation } from "@/models/ReservationModels";

export function useReservation() {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get("/reservation", {
        validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
      });

      setReservations(response.data.data);
    } catch (err: any) {
      setError(err.code || "Failed to load reservation data");
    } finally {
      setIsLoading(false);
    }
  }

  function refresh() {
    fetchReservations();
  }

  return { reservations: reservations, isLoading, error, refresh };
}
