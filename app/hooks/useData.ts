import apiClient from "@/utils/apiClient";
import { useEffect, useState } from "react";

type SetData<T> = React.Dispatch<React.SetStateAction<T[]>>;

export function useData<T>(
  url: string,
  defaultData: T[] = []
): [T[], SetData<T>, boolean, () => void] {
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

  function refresh() {
    setIsLoading(true);
    getData();
  }

  useEffect(() => {
    getData();
  }, []);

  return [data, setData, isLoading, refresh];
}
