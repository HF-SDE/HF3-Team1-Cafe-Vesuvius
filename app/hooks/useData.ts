import apiClient from "@/utils/apiClient";
import { useEffect, useState } from "react";

export function useData<T>(
  url: string,
  defaultData: T[] = []
): [T[], (data: T[]) => void, boolean] {
  const [data, setData] = useState<T[]>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  async function getData() {
    try {
      const response = await apiClient.get(url);
      setData(response.data.data);
    } catch (error) {
      console.error("Error while fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return [data, setData, isLoading];
}
