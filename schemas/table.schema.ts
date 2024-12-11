import Joi from "./joi";
import { Table } from "../backend/node_modules/.prisma/client";
import { UuidSchema } from "./general.schemas";

export default Joi.object<Table>({
  number: Joi.number().positive().required(),
  capacity: Joi.number().positive().optional(),
});

interface AdditionalSearchQuery {
  reservedNow?: boolean;
}

export const search = Joi.object<Partial<Table> & AdditionalSearchQuery>({
  id: UuidSchema.optional(),
  reservedNow: Joi.boolean(),
  number: Joi.number().positive(),
});
