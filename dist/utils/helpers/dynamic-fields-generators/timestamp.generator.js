"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const generateEqTimestampFieldBasedOnEqSelectedDate = (contactData) => {
    if (contactData.eduQuestSelectedDateTime === null)
        return '';
    const momentDate = (0, moment_1.default)(contactData.eduQuestSelectedDateTime);
    const formatedDate = momentDate.tz(contactData.timezone).format('MMMM DD, YYYY HH:mm');
    return `${formatedDate} ${contactData.timezone}`;
};
exports.default = generateEqTimestampFieldBasedOnEqSelectedDate;
//# sourceMappingURL=timestamp.generator.js.map