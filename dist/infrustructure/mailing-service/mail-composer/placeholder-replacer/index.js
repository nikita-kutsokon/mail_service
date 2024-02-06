"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const static_data_handlers_1 = __importDefault(require("./handlers/static-data.handlers"));
const dynamic_data_handlers_1 = __importDefault(require("./handlers/dynamic-data.handlers"));
const replacePlaceholders = async (text, contactData) => {
    const placeholderIdentifierRegex = /%(\w+)%/g;
    const replacements = await Promise.all(Array.from(text.matchAll(placeholderIdentifierRegex), async ([match, placeholder]) => {
        const handler = static_data_handlers_1.default[`%${placeholder}%`] || dynamic_data_handlers_1.default[`%${placeholder}%`];
        const result = handler ? await handler(contactData) : match;
        return { match, result };
    }));
    let formattedMailText = text;
    replacements.forEach(({ match, result }) => {
        formattedMailText = formattedMailText.replace(match, result);
    });
    return formattedMailText;
};
exports.default = {
    replacePlaceholders
};
//# sourceMappingURL=index.js.map