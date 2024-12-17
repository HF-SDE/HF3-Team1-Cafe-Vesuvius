import Joi from "./joi";
import { UuidSchema } from "./general.schemas";

export const getPermissionSchema = Joi.object({
  id: UuidSchema.optional(),
  code: Joi.string().min(1).optional(),
  permissionGroupId: UuidSchema.optional(),
});
