import joi from "joi";
import { PasswordSchema } from "./password.schemas";

export const ChangePasswordBase64Schema = joi.object({
  newPassword: joi.string().base64().required(),
  oldPassword: joi.string().base64().required(),
});

export const ChangePasswordSchema = joi.object({
  newPassword: PasswordSchema.invalid(joi.ref("oldPassword"))
    .messages({
      "any.invalid":
        "You new password must not be the same as your old password",
    })
    .required(),
  oldPassword: joi.string().required(),
});

export const jwtTokenSchema = joi
  .string()
  .pattern(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)$/)
  .required();
