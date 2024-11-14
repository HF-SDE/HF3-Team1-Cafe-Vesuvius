import joi from "joi";

export const changePasswordSchema = joi.object({
  newPassword: joi.string().base64().required(),
  oldPassword: joi.string().base64().required(),
});
