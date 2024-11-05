import { Status } from '@api-types/general.types';
import { IStockResponse, StockResult } from '@api-types/stock.types';
import prisma from '@prisma-instance';

/**
 * Service to get all stocks items
 * @async
 * @param {string} id - The id of the stock item to get.
 * @returns {Promise<IStockResponse>} A promise that resolves to an object containing the stock data, status, and message.
 */
export async function getStock(id?: string): Promise<IStockResponse> {
  try {
    let result: StockResult;
    if (id) {
      result = await prisma.rawMaterial.findMany();
    } else {
      result = await prisma.rawMaterial.findUnique({
        where: {
          id,
        },
      });
    }

    return {
      data: result,
      status: Status.Found,
      message: 'Stocks item(s) found',
    };
  } catch {
    return {
      data: null,
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}
