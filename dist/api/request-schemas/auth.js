"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
});
const loginSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
});
exports.default = {
    registerSchema,
    loginSchema
};
//# sourceMappingURL=auth.js.map