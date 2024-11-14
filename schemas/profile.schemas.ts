import joi from "joi";

export const changePasswordSchema = joi.object({
  newPassword: joi.string().base64().required(),
  oldPassword: joi.string().base64().required(),
});

export const jwtTokenSchema = joi
  .string()
  .pattern(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)$/);
