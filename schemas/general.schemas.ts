import Joi from "joi";

export const UuidSchema = Joi.string().pattern(/^[a-fA-F0-9]{24}$/, 'ObjectId Validation');
