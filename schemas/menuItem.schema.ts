import Joi from "./joi";
import { MenuItem, Prisma } from "../backend/node_modules/.prisma/client";
import { UuidSchema } from "./general.schemas";

const schema = Joi.object<MenuItem>({
  category: Joi.array().items(Joi.string()).required(),
  name: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
});

export default schema;

const keys = Object.keys(schema.describe().keys);
export const optional = schema.fork(keys, (schema) => schema.optional());

export const patch = schema.append<Prisma.MenuItemUpdateInput>({
  RawMaterial_MenuItems: Joi.object({
    deleteMany: Joi.object(),
    createMany: Joi.object({
      data: Joi.array().items(
        Joi.object({
          id: UuidSchema.optional(),
          quantity: Joi.number().required(),
          rawMaterialId: Joi.string().required(),
        }).options({ stripUnknown: true })
      ),
    }),
  }),
});
