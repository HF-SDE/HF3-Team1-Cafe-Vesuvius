import Joi from "./joi";
import { Table } from "../backend/node_modules/.prisma/client";

export default Joi.object<Table>({
  number: Joi.number().positive().required(),
  capacity: Joi.number().positive().optional(),
});
