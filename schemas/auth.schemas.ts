import Joi from "joi";


export const LoginSchema = Joi.object({
  username: Joi.string().min(1).required(),
  password: Joi.string().min(1).base64().required(),
});

export const TokenSchema = Joi.object({
  token: Joi.string()
    .regex(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)$/)
    .required(),
});
