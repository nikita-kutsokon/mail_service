"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const contacts_service_1 = __importDefault(require("../../api/services/contacts.service"));
const sent_mails_service_1 = __importDefault(require("../../api/services/sent-mails.service"));
const scheduled_mails_service_1 = __importDefault(require("../../api/services/scheduled-mails.service"));
const mail_composer_service_1 = __importDefault(require("../services/mail/mail-composer.service"));
const mail_sender_service_1 = __importDefault(require("../services/mail/mail-sender.service"));
const uniqueEmailDecorator_1 = __importDefault(require("../../user-actions-system/helpers/uniqueEmailDecorator"));
const sentMail = async (receiverEmail, mailText) => {
    await mail_sender_service_1.default.sentComposedMail(receiverEmail, mailText);
};
const sentScheduledMail = async (scheduledMailData) => {
    const { id, mailingAutomationId, useContactTimezone, ...mainMailData } = scheduledMailData;
    const contactData = await contacts_service_1.default.getContactById(mainMailData.contactId);
    if (!contactData.isSubscribed) {
        await scheduled_mails_service_1.default.deleteMailById(id);
        return;
    }
    const composedMail = await mail_composer_service_1.default.composeMail(contactData, mainMailData.templateId);
    const composedMailWithTrakingFeature = (0, uniqueEmailDecorator_1.default)(composedMail, { contactId: contactData.id, emailId: scheduledMailData.id });
    await mail_sender_service_1.default.sentComposedMail(contactData.email, composedMailWithTrakingFeature);
    await scheduled_mails_service_1.default.deleteMailById(id);
    await sent_mails_service_1.default.createRecord({ ...mainMailData, emailId: id });
    return composedMailWithTrakingFeature;
};
const startSendingOutPendingMails = async () => {
    const pendingMails = await scheduled_mails_service_1.default.getPendingMails();
    const batchOfTargetMails = pendingMails.slice(0, Number(process.env.MESSAGES_PER_MOMENT));
    for (const targetScheduledMail of batchOfTargetMails) {
        if (isTimeToSendMail(targetScheduledMail)) {
            await sentScheduledMail(targetScheduledMail);
        }
    }
};
const isTimeToSendMail = (scheduledMailData) => {
    return moment_timezone_1.default.utc().isSameOrAfter(scheduledMailData.scheduledDate);
};
exports.default = {
    sentMail,
    startSendingOutPendingMails
};
//# sourceMappingURL=mail-manager.js.map