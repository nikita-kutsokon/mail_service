"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const contactData_1 = __importDefault(require("../services/contactData"));
const scheduled_mails_service_1 = __importDefault(require("../services/scheduled-mails.service"));
const mail_sender_1 = __importDefault(require("../../infrustructure/mailing-service/mail-sender"));
const MESSAGES_PER_MOMENT = Number(process.env.MESSAGES_PER_MOMENT);
const sentPendingMails = async () => {
    const pendingMails = (await scheduled_mails_service_1.default.retrievePendingMails()).slice(0, 10);
    for (let i = 0; i < pendingMails.length; i += MESSAGES_PER_MOMENT) {
        const batchOfPendingMails = pendingMails.slice(i, i + MESSAGES_PER_MOMENT);
        console.log(batchOfPendingMails);
        batchOfPendingMails.forEach(async (processedSheduledMailData) => {
            const { contactId, id, templateId, useContactTimezone, mailingAutomationId, ...restOfFields } = processedSheduledMailData;
            const contactData = await contactData_1.default.retrieveContactData(contactId);
            if (isTimeToSendMail(processedSheduledMailData) && contactData.isSubscribed) {
                await mail_sender_1.default.sentMail(contactData, templateId);
                await scheduled_mails_service_1.default.deletePendingMail(id);
            }
        });
        console.log('finish batching sending');
    }
};
const isTimeToSendMail = (scheduledMailData) => {
    const { scheduledDate } = scheduledMailData;
    return moment_1.default.utc().isSameOrAfter(scheduledDate);
};
exports.default = sentPendingMails;
//# sourceMappingURL=sent-pending-mails.js.map