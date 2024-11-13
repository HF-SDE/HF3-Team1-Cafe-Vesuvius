import joi from "joi";
import { UuidSchema } from "./general.schemas";

export const getUser = joi.object({
    id: UuidSchema,
    username: joi.string().alphanum(),
    email: joi.string().email(),
})
