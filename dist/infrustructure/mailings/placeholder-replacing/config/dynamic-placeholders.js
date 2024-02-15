"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const dynamicPlaceholderHandlers = {
    '%EQ_SELECTED_DATE_TYPE%': (contactData) => eqSelectedDateTimePlaceholderReplacer(contactData),
    // '%INTERNSHIP_SCHEDULE%': (contactData: Contact) => internshipSchedulePlaceholderReplacer(contactData), 
};
// const internshipSchedulePlaceholderReplacer = (contactData: Contact) => {
//     return contactData.internshipProgramType === 'WEEKDAY'
//         ? 'every Monday, Tuesday, Wednesday, and Friday'
//         : 'every Saturday and Sunday'
// };
const eqSelectedDateTimePlaceholderReplacer = (contactData) => {
    const momentDate = (0, moment_1.default)(contactData.eduQuestSelectedDateTime);
    return momentDate.format('MMMM D, YYYY HH:mm');
};
exports.default = dynamicPlaceholderHandlers;
//# sourceMappingURL=dynamic-placeholders.js.map