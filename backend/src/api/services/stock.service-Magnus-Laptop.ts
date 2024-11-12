import { APIResponse, Status } from '@api-types/general.types';
import { StockResult } from '@api-types/stock.types';
import prisma from '@prisma-instance';
import { UuidSchema } from '@schemas/general.schemas';

/**
 * Service to get all stocks items
 * @async
 * @param {string} id - The id of the stock item to get.
 * @returns {Promise<APIResponse<StockResult>>} A promise that resolves to an object containing the stock data, status, and message.
 */
export async function getStock(id?: string): Promise<APIResponse<StockResult>> {
  try {
    let result: StockResult | null;
    if (id) {
      // Validate the id
      const validate = UuidSchema.validate(id);
      if (validate.error) {
        return {
          data: undefined,
          status: Status.Failed,
          message: validate.error.message,
        };
      }

      // Find the stock item by id
      result = await prisma.rawMaterial.findUnique({
        where: {
          id,
        },
      });
    } else {
      result = await prisma.rawMaterial.findMany();
    }

    if (!result) {
      return {
        data: undefined,
        status: Status.NotFound,
        message: 'Stocks item(s) not found',
      };
    }

    return {
      data: result,
      status: Status.Found,
      message: 'Stocks item(s) found',
    };
  } catch {
    return {
      data: undefined,
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}
