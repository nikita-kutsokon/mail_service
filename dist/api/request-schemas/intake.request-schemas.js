"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validStatusValues = ['CLOSED', 'OPENED'];
const validProgramValues = ['WEEKDAY', 'WEEKEND'];
const createResourse = joi_1.default.object({
    eventDate: joi_1.default.date().required(),
    orientationEventDateTime: joi_1.default.date().required(),
    firstInternshipClassDateTime: joi_1.default.date().required(),
    applicationDeadline: joi_1.default.date().required(),
    programType: joi_1.default.string().valid(...validProgramValues).required(),
    status: joi_1.default.string().valid(...validStatusValues),
});
const updateResource = joi_1.default.object({
    eventDate: joi_1.default.date(),
    orientationEventDateTime: joi_1.default.date(),
    firstInternshipClassDateTime: joi_1.default.date(),
    applicationDeadline: joi_1.default.date(),
    programType: joi_1.default.string().valid(...validProgramValues),
    status: joi_1.default.string().valid(...validStatusValues),
});
exports.default = {
    createResourse,
    updateResource
};
//# sourceMappingURL=intake.request-schemas.js.map