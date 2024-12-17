import { Menu } from "@/app/(auth)/order/new-order";
import { useData } from "@/hooks/useData";
import { StockItemModel } from "@/models/StorageModel";
import { CartItem } from "@/types/cartReducer.types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";

type Stock = Required<StockItemModel> & { newQuantity: number };

interface StockContextProps {
  stock: Stock[];
  setStock: Dispatch<SetStateAction<Stock[]>>;
}

const StockContext = createContext<StockContextProps>({} as StockContextProps);

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [stock, setStock] = useData<Stock>("/stock");

  useEffect(() => {
    if (!stock) return;

    for (const item of stock) {
      item.newQuantity ??= item.quantity;
    }
  }, [stock]);

  return (
    <StockContext.Provider value={{ stock, setStock }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStockContext() {
  return useContext(StockContext);
}

export function getMissingItems(menuItem: Menu, stock: Stock[]): string[] {
  const missingItems: string[] = [];

  for (const RawMaterialMenuItem of menuItem.RawMaterial_MenuItems) {
    const stockItem = stock.find(
      ({ id }) => id === RawMaterialMenuItem.RawMaterial.id
    );

    if (!stockItem) {
      missingItems.push(RawMaterialMenuItem.RawMaterial.name);
      continue;
    }

    if (stockItem.newQuantity < RawMaterialMenuItem.quantity) {
      missingItems.push(RawMaterialMenuItem.RawMaterial.name);
    }
  }

  return missingItems;
}

export function updateStock(
  cartItem: CartItem,
  stock: Stock[],
  setStock: Dispatch<SetStateAction<Stock[]>>,
  isAdd = true,
  quantity = 1
) {
  if (!cartItem) return;

  for (const RawMaterialMenuItem of cartItem.item.RawMaterial_MenuItems) {
    const stockItem = stock.find(
      ({ id }) => id === RawMaterialMenuItem.RawMaterial.id
    );

    if (!stockItem) return;

    stockItem.newQuantity ??= stockItem.quantity;

    const operator = isAdd ? -1 : 1;

    stockItem.newQuantity += operator * RawMaterialMenuItem.quantity * quantity;

    stockItem.newQuantity = Math.round(stockItem.newQuantity * 100) / 100;
  }
  setStock([...stock]);
}
