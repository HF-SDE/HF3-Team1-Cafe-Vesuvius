import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { MenuModel } from "../models/MenuModel";

export function useMenu(id?: string | string[]) {
  const [menu, setMenu] = useState<MenuModel[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const endpoint = id ? `/menu?id=${id}` : "/menu";
      const response = await apiClient.get(endpoint);

      setMenu(response.data.data);
    } catch (err: any) {
      setError("Failed to load menu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [id]);

  const refreshMenu = async () => {
    await fetchMenu();
  };

  const createMenu = async (newMenu: MenuModel) => {
    try {
      const { id, ...payload } = newMenu;
      const response = await apiClient.post("/menu", payload);
      if (response.status === 201) {
        await fetchMenu();
      }
    } catch (err: any) {
      setError("Failed to create menu");
    }
  };

  const updateMenu = async (updatedMenu: MenuModel) => {
    try {
      const { id, ...payload } = updatedMenu;
      const response = await apiClient.put(`/menu/${updatedMenu.id}`, payload);

      if (response.status === 200) {
        setMenu(
          (prevMenu) =>
            prevMenu?.map((item) =>
              item.id === updatedMenu.id ? { ...item, ...updatedMenu } : item
            ) ?? null
        );
      }
    } catch (err: any) {
      setError("Failed to update menu");
    }
  };
  const deleteMenu = async (deleteMenuId: string) => {
    try {
      if (!deleteMenuId) {
        return;
      }
      const response = await apiClient.delete(`/menu/${deleteMenuId}`);
      if (response.status === 200) {
        await fetchMenu();
        setMenu(
          (prevMenu) =>
            prevMenu?.filter((item) => item.id !== deleteMenuId) ?? null
        );
      }
    } catch (err: any) {
      setError("Failed to delete menu");
    }
  };

  return {
    menu,
    isLoading,
    error,
    createMenu,
    updateMenu,
    deleteMenu,
    refreshMenu,
  };
}
