"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contactData_1 = __importDefault(require("../services/contactData"));
const scheduled_mails_service_1 = __importDefault(require("../services/scheduled-mails.service"));
// import MailSender from '../../infrustructure/services/mail/mail-sender.service';
// import MailComposer from '../../infrustructure/services/mail/mail-composer.service';
const mail_time_coordinator_service_1 = __importDefault(require("../../infrustructure/services/mail/mail-time-coordinator.service"));
const mailing_service_1 = __importDefault(require("../../infrustructure/mailing-service"));
const MESSAGES_PER_MOMENT = Number(process.env.MESSAGES_PER_MOMENT);
const sentPendingMails = async () => {
    const pendingMails = (await scheduled_mails_service_1.default.retrievePendingMails()).slice(0, 10);
    for (let i = 0; i < pendingMails.length; i += MESSAGES_PER_MOMENT) {
        const batchOfPendingMails = pendingMails.slice(i, i + MESSAGES_PER_MOMENT);
        console.log(batchOfPendingMails);
        batchOfPendingMails.forEach(async (processedSheduledMailData) => {
            const { contactId, id, templateId, useContactTimezone, mailingAutomationId, ...restOfFields } = processedSheduledMailData;
            const contactData = await contactData_1.default.retrieveContactData(contactId);
            if (mail_time_coordinator_service_1.default.isTimeToSendMail(processedSheduledMailData) && contactData.isSubscribed) {
                // const composedMail = await MailComposer.composeMail(contactData, templateId);
                // const composedIdentifiedMail = modifyEmailTextWithUniqueValues(composedMail, {contactId, emailId: id})
                // await MailSender.sentComposedMail(contactData.email, composedIdentifiedMail);
                await mailing_service_1.default.sentMail(contactData, templateId);
                await scheduled_mails_service_1.default.deletePendingMail(id);
                // await SendedMailsService.addSendedMail({emailId: id, contactId, templateId, ...restOfFields});
            }
        });
        console.log('finish batching sending');
    }
};
exports.default = sentPendingMails;
//# sourceMappingURL=sent-pending-mails.js.map