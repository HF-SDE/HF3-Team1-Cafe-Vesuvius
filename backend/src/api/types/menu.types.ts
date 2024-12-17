import { Prisma, RawMaterial, RawMaterial_MenuItem } from '@prisma/client';

export interface MenuRequestBody {
  RawMaterial_MenuItems:
    | (CustomRawMaterialMenuItem & RawMaterial_MenuItem)[]
    | Prisma.MenuItemCreateInput['RawMaterial_MenuItems'];
}

export interface CustomRawMaterialMenuItem {
  quantity: number;
  RawMaterial?: RawMaterial;
}
