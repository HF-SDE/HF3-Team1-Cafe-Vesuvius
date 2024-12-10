import { StockItemModel } from "./StorageModel";
export interface MenuModel {
  id?: string;
  category?: string[];
  name?: string;
  price?: number;
  RawMaterial_MenuItems?: RawMaterial_MenuItems[];
}

export interface RawMaterial_MenuItems {
  id?: string;
  quantity: number;
  RawMaterial: Required<StockItemModel>;
}
