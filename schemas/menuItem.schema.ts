import Joi from "./joi";
import { MenuItem } from "../backend/node_modules/.prisma/client";

const schema = Joi.object<MenuItem>({
  category: Joi.array().items(Joi.string()).required(),
  name: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
});

export default schema;

const keys = Object.keys(schema.describe().keys);
export const optional = schema.fork(keys, (schema) => schema.optional());
