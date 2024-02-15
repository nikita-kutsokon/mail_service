"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const client_1 = require("@prisma/client");
const prisma_client_1 = __importDefault(require("../../../../../database/prisma-client"));
const dynamicPlaceholderHandlers = {
    '%INTERNSHIP_SCHEDULE%': (contactData) => internshipSchedulePlaceholderReplacer(contactData),
    '%ORIENTATION_DAY_DATE%': (contactData) => orientationDayDatePlaceholderReplacer(contactData),
    '%FIRST_INTERNSHIP_CLASS_DATE%': (contactData) => firstInternshipClassDatePlaceholderReplacer(contactData)
};
const orientationDayDatePlaceholderReplacer = async (contactData) => {
    const { orientationEventDateTime } = await prisma_client_1.default.intake.findUnique({
        where: {
            eventDate: contactData.eduQuestSelectedDateTime
        }
    });
    const formatedOrientationDayDate = (0, moment_1.default)(orientationEventDateTime).tz(contactData.timezone).format('MMMM D, YYYY HH:mm');
    return `${formatedOrientationDayDate}, ${contactData.timezone}`;
};
const firstInternshipClassDatePlaceholderReplacer = async (contactData) => {
    const { firstInternshipClassDateTime } = await prisma_client_1.default.intake.findUnique({
        where: {
            eventDate: contactData.eduQuestSelectedDateTime
        }
    });
    const formatedOrientationDayDate = (0, moment_1.default)(firstInternshipClassDateTime).tz(contactData.timezone).format('MMMM D, YYYY HH:mm');
    return `${formatedOrientationDayDate}, ${contactData.timezone}`;
};
const internshipSchedulePlaceholderReplacer = async (contactData) => {
    const contactSelectedIntake = await prisma_client_1.default.intake.findUnique({
        where: {
            eventDate: contactData.eduQuestSelectedDateTime
        }
    });
    return contactSelectedIntake.programType === client_1.InternShipProgramType.WEEKDAY
        ? 'every Monday, Tuesday, Wednesday, and Friday'
        : 'every Saturday and Sunday';
};
exports.default = dynamicPlaceholderHandlers;
//# sourceMappingURL=dynamic-data.handlers.js.map