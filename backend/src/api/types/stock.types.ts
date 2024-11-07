import { Prisma, RawMaterial } from '@prisma/client';

interface UpdateItem extends Prisma.RawMaterialUpdateManyMutationInput {
  id: string;
}

export type StockResult = RawMaterial[] | RawMaterial;

export interface StockUpdate {
  items: UpdateItem[];
}
