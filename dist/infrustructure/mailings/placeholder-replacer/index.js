"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const static_data_handlers_1 = __importDefault(require("./handlers/static-data.handlers"));
const dynamic_data_handlers_1 = __importDefault(require("./handlers/dynamic-data.handlers"));
const replacePlaceholders = (text, contactData) => {
    const placeholderIdentifierRegex = /%(\w+)%/g;
    const formatedMailText = text.replace(placeholderIdentifierRegex, (match, placeholder) => {
        const handler = static_data_handlers_1.default[`%${placeholder}%`] || dynamic_data_handlers_1.default[`%${placeholder}%`];
        return handler ? handler(contactData) : match;
    });
    return formatedMailText;
};
exports.default = {
    replacePlaceholders
};
//# sourceMappingURL=index.js.map