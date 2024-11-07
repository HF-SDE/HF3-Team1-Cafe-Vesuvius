import { APIResponse, IAPIResponse, Status } from '@api-types/general.types';
import { StockResult } from '@api-types/stock.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { UuidSchema } from '@schemas/general.schemas';
import { StockCreateSchema, StockUpdateSchema } from '@schemas/stock.schemas';

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
          status: Status.InvalidDetails,
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

/**
 * Service to create a stock item
 * @param {Prisma.RawMaterialCreateInput} data - The data to create a stock item.
 * @returns {Promise<IAPIResponse>} A promise that resolves to an object containing the status and message.
 */
export async function create(
  data: Prisma.RawMaterialCreateWithoutRawMaterial_MenuItemsInput,
): Promise<IAPIResponse> {
  try {
    // Validate the id
    const validate = StockCreateSchema.validate(data);
    if (validate.error) {
      return {
        status: Status.InvalidDetails,
        message: validate.error.message,
      };
    }

    const result = await prisma.rawMaterial.create({
      data,
    });

    if (!result) {
      return {
        status: Status.CreationFailed,
        message: 'Stock item not created',
      };
    }

    return {
      status: Status.Created,
      message: 'Add new material to stock',
    };
  } catch {
    return {
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}

interface StockUpdate extends Prisma.RawMaterialUpdateManyMutationInput {
  id: string;
}

/**
 * Service to update a stock item
 * @param {Prisma.RawMaterialCreateInput[]} data - The data to update a stock item.
 * @returns {Promise<IAPIResponse>} A promise that resolves to an object containing the status and message.
 */
export async function update(data: StockUpdate[]): Promise<IAPIResponse> {
  try {
    const validate = StockUpdateSchema.validate(data);
    if (validate.error) {
      return {
        status: Status.Failed,
        message: validate.error.message,
      };
    }

    const transaction = data.map(({quantity, unit, id}) => {
      return prisma.rawMaterial.update({
        where: {
          id,
        },
        data: {
          quantity,
          unit
        },
      });
    });
    
    const result = await prisma.$transaction(transaction);

    if (!result) {
      return {
        status: Status.UpdateFailed,
        message: 'Failed to update item in stock',
      };
    }

    return {
      status: Status.Updated,
      message: 'Item(s) updated',
    };
  } catch (e: any) {
    console.log(e);
    return {
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}
