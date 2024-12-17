import Joi from "./joi";

import { UuidSchema } from "./general.schemas";

const Order_MenuSchema = Joi.object({
  id: UuidSchema.required(),
  status: Joi.string()
    .valid("toPrepare", "completed", "deliver")
    .required()
    .messages({
      "any.only": "({#key}) must one of {#valids}",
    }),
}).messages({
  "object.unknown": "({#child}) is nost allowed",
});

export default Order_MenuSchema;

export const Order_MenusSchema = Joi.array()
  .items(Order_MenuSchema)
  .min(1)
  .required();
