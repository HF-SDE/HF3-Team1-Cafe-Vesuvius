import Joi from "joi";

export const UuidSchema = Joi.string().guid();
