"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const createResourseSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    eduQuestStartDate: joi_1.default.date().iso(),
});
const updateResourseSchema = joi_1.default.object({
    name: joi_1.default.string(),
    eduQuestStartDate: joi_1.default.date().iso(),
});
const addRecordContactsToMailingAutomationSchema = joi_1.default.object({
    listId: joi_1.default.string().required(),
    mailingAutomationId: joi_1.default.string().required()
});
exports.default = {
    createResourseSchema,
    updateResourseSchema,
    addRecordContactsToMailingAutomationSchema
};
//# sourceMappingURL=contacts-lists.request-schemas.js.map