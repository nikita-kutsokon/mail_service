"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const static_placeholders_1 = __importDefault(require("./config/static-placeholders"));
const dynamic_placeholders_1 = __importDefault(require("./config/dynamic-placeholders"));
const replacePlaceholders = (text, contactData) => {
    const placeholderIdentifierRegex = /%(\w+)%/g;
    const formatedMailText = text.replace(placeholderIdentifierRegex, (match, placeholder) => {
        const handler = static_placeholders_1.default[`%${placeholder}%`] || dynamic_placeholders_1.default[`%${placeholder}%`];
        return handler ? handler(contactData) : match;
    });
    return formatedMailText;
};
exports.default = {
    replacePlaceholders
};
//# sourceMappingURL=index.js.map