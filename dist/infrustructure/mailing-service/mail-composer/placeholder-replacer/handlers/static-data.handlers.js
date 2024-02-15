"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const staticPlaceholderHandlers = {
    '%NAME%': (contactData) => firstNamePlaceholderReplacer(contactData),
    '%SURNAME%': (contactData) => lastNamePlacehoderReplacer(contactData),
    '%EDUQUEST_TIMESTAMP%': (contactData) => eqTimestampPlacehoderReplacer(contactData),
    '%EQ_SELECTED_DATE%': (contactData) => eqSelectedDateTimePlaceholderReplacer(contactData),
};
const lastNamePlacehoderReplacer = (contactData) => contactData.lastName;
const firstNamePlaceholderReplacer = (contactData) => contactData.firstName;
const eqTimestampPlacehoderReplacer = (contactData) => contactData.eduQuestEventTimestamp;
const eqSelectedDateTimePlaceholderReplacer = (contactData) => {
    return (0, moment_1.default)(contactData.eduQuestSelectedDateTime).format('MMMM D, YYYY');
};
exports.default = staticPlaceholderHandlers;
//# sourceMappingURL=static-data.handlers.js.map