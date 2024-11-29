import { OrderModel } from "@/models/OrderModel";
import apiClient from "@/utils/apiClient";
import { useEffect, useState } from "react";

export function useOrder(defaultOrders: OrderModel[] = []) {
  const [orders, setOrders] = useState<OrderModel[]>(defaultOrders);
  const [isLoading, setIsLoading] = useState(true);

  async function getOrders() {
    try {
      const response = await apiClient.get("/order");
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error while fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  return { orders, setOrders, isLoading };
}
