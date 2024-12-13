import Joi from "./joi";
import { UuidSchema } from "./general.schemas";

const schema = Joi.object({
  category: Joi.array().items(Joi.string()).optional(),
  name: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
  active: Joi.boolean().optional(),
});

export default schema.append({
  RawMaterial_MenuItems: Joi.object({
    createMany: Joi.object({
      data: Joi.array().items(
        Joi.object({
          quantity: Joi.number().required(),
          rawMaterialId: Joi.string().required(),
        }).options({ stripUnknown: true })
      ),
    }),
  }),
});

const keys = Object.keys(schema.describe().keys);
export const optional = schema.fork(keys, (schema) => schema.optional());

export const patch = schema.append({
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
