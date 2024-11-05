import { RawMaterial } from '@prisma/client';

import { IAPIResponse } from './general.types';

export interface IStockResponse extends IAPIResponse {
  data: StockResult;
}

export type StockResult = RawMaterial[] | RawMaterial | null;
