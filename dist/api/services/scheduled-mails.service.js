"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const prisma_client_1 = __importDefault(require("../../database/prisma-client"));
const http_errors_1 = __importDefault(require("../../utils/http-errors"));
const createMails = async (mailData) => {
    if (mailData.useContactTimezone) {
        const { scheduledDate, contactId } = mailData;
        const { timezone: contactTimezone } = await prisma_client_1.default.contact.findUnique({ where: { id: contactId } });
        const utcTime = moment_timezone_1.default.utc();
        const scheduledMoment = (0, moment_timezone_1.default)(scheduledDate).utc();
        const contactTimezoneOffsetInMinutes = utcTime.tz(contactTimezone).utcOffset();
        const adjustedScheduledDateTime = scheduledMoment.subtract(contactTimezoneOffsetInMinutes, 'minutes').toDate();
        mailData.scheduledDate = adjustedScheduledDateTime;
    }
    const result = await prisma_client_1.default.scheduledMail.create({ data: mailData });
    return result;
};
const getMailById = async (id) => {
    const result = await prisma_client_1.default.scheduledMail.findUnique({ where: { id } });
    if (!result) {
        throw http_errors_1.default.NotFound(`The requested resource with id - ${id} could not be found on the server`);
    }
    return result;
};
const deleteMailById = async (id) => {
    const result = await prisma_client_1.default.scheduledMail.delete({ where: { id } });
    return result;
};
const updateMailById = async (id, mailData) => {
    const result = await prisma_client_1.default.scheduledMail.update({ where: { id }, data: mailData });
    return result;
};
const getMailsList = async () => {
    const result = await prisma_client_1.default.scheduledMail.findMany();
    return result;
};
const getPendingMails = async () => {
    const currentDateTimeUTC = moment_timezone_1.default.utc().toDate();
    const pendingMails = await prisma_client_1.default.scheduledMail.findMany({
        where: {
            scheduledDate: {
                lt: currentDateTimeUTC
            }
        }
    });
    return pendingMails;
};
exports.default = {
    createMails,
    getMailById,
    deleteMailById,
    updateMailById,
    getMailsList,
    getPendingMails
};
//# sourceMappingURL=scheduled-mails.service.js.map