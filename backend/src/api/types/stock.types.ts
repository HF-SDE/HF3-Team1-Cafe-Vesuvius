import { Prisma, RawMaterial } from '@prisma/client';

interface UpdateItem extends Prisma.RawMaterialUpdateManyMutationInput {
  id: string;
}

export type StockResult = RawMaterial[] | RawMaterial | Prisma.RawMaterialCreateInput[];

export interface StockUpdate {
  items: UpdateItem[];
}
