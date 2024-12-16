import { APIResponse, Status } from '@api-types/general.types';
import { StockResult, StockUpdate } from '@api-types/stock.types';
import prisma from '@prisma-instance';
import { Prisma } from '@prisma/client';
import { UuidSchema } from '@schemas/general.schemas';
import {
  StockCreateSchema,
  StockUpdateSchema,
} from '@schemas/rawMaterial.schema';

/**
 * Service to get all stocks items
 * @async
 * @param {string} id - The id of the stock item to get.
 * @returns {Promise<APIResponse<StockResult>>} A promise that resolves to an object containing the stock data, status, and message.
 */
export async function get(id?: string): Promise<APIResponse<StockResult>> {
  try {
    if (id) {
      // Validate the id
      const validate = UuidSchema.validate(id);
      if (validate.error) {
        return {
          status: Status.InvalidDetails,
          message: validate.error.message,
        };
      }
    }
    const result = await prisma.rawMaterial.findMany({
      where: {
        id,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!result || (result.length === 0 && id)) {
      return {
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
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}

/**
 * Service to create a stock item
 * @param {Prisma.RawMaterialCreateWithoutRawMaterial_MenuItemsInput} data - The data to create a stock item.
 * @returns {Promise<APIResponse>} A promise that resolves to an object containing the status and message.
 */
export async function create(
  data: Prisma.RawMaterialCreateWithoutRawMaterial_MenuItemsInput,
): Promise<APIResponse> {
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

/**
 * Service to update a stock item
 * @param {StockUpdate[]} data - The data to update a stock item.
 * @returns {Promise<APIResponse>} A promise that resolves to an object containing the status and message.
 */
export async function update(data: StockUpdate[]): Promise<APIResponse> {
  try {
    const validate = StockUpdateSchema.validate(data);
    if (validate.error) {
      return {
        status: Status.InvalidDetails,
        message: validate.error.message,
      };
    }

    const transaction = [];
    for (const item of data) {
      const { id, quantity, unit, name } = item;
      transaction.push(
        prisma.rawMaterial.update({
          where: {
            id,
          },
          data: {
            quantity,
            unit,
            name,
          },
        }),
      );
    }

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
  } catch {
    return {
      status: Status.Failed,
      message: 'Something went wrong on our end',
    };
  }
}
