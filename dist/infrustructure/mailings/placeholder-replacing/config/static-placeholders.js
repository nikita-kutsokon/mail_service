"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const staticPlaceholderHandlers = {
    '%NAME%': (contactData) => firstNamePlaceholderReplacer(contactData),
    '%SURNAME%': (contactData) => lastNamePlacehoderReplacer(contactData),
    '%EDUQUEST_TIMESTAMP%': (contactData) => eqTimestampPlacehoderReplacer(contactData)
};
const lastNamePlacehoderReplacer = (contactData) => contactData.lastName;
const firstNamePlaceholderReplacer = (contactData) => contactData.firstName;
const eqTimestampPlacehoderReplacer = (contactData) => contactData.eduQuestEventTimestamp;
exports.default = staticPlaceholderHandlers;
//# sourceMappingURL=static-placeholders.js.map