import { Prisma, RawMaterial } from '@prisma/client';

interface UpdateItem extends Prisma.RawMaterialUpdateManyMutationInput {
  id: string;
}

export type StockResult =
  | RawMaterial[]
  | RawMaterial
  | Prisma.RawMaterialCreateInput[];

export interface StockUpdate {
  items: UpdateItem[];
}

export interface StockUpdate extends Prisma.RawMaterialUpdateManyMutationInput {
  id: string;
}

export interface StockRequestQuery extends qs.ParsedQs {
  id: string | undefined;
}

export interface StockRequestBody {
  items: StockUpdate[];
}
