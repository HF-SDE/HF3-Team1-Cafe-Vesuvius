import Joi from "./joi";
import { UuidSchema } from "./general.schemas";

const schema = Joi.object({
  category: Joi.array().items(Joi.string()).optional(),
  name: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
  active: Joi.boolean().optional(),
});

export const createInput = schema.append({
  RawMaterial_MenuItems: Joi.array().items(
    Joi.object({
      rawMaterialId: UuidSchema.optional(),
      RawMaterial: Joi.object({
        id: UuidSchema.optional(),
      }).optional(),
      quantity: Joi.number().required(),
    })
      .options({ stripUnknown: true })
      .or("rawMaterialId", "RawMaterial")
  ),
});

export const create = schema.append({
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

export const where = Joi.object({
  id: UuidSchema.optional(),
  category: Joi.array().items(Joi.string()).optional(),
  name: Joi.string().min(1).optional(),
  price: Joi.number().positive().optional(),
  active: Joi.boolean().optional(),
});
