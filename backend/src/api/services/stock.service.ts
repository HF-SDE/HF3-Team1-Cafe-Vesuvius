import { Status } from '@api-types/general.types';
import { IStockResponse, StockResult } from '@api-types/stock.types';
import prisma from '@prisma-instance';
import { UuidSchema } from '@schemas/general.schemas';

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
      // Validate the id
      const validate = UuidSchema.validate(id);
      if (validate.error) {
        return {
          data: null,
          status: Status.Failed,
          message: validate.error.message,
        };
      }
      result = await prisma.rawMaterial.findUnique({
        where: {
          id,
        },
      });
    } else {
      result = await prisma.rawMaterial.findMany();
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
