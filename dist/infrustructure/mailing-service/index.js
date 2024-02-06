"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
const config_1 = __importDefault(require("./config"));
const mail_composer_1 = __importDefault(require("./mail-composer"));
const set_mail_service_1 = __importDefault(require("./services/set-mail.service"));
const transporter = nodemailer.createTransport(config_1.default);
const sentMail = async (contactData, mailTemplateId, subject = 'Eduquest event') => {
    const composedMail = await mail_composer_1.default.composeMail(contactData, mailTemplateId);
    await transporter.sendMail({
        to: contactData.email,
        subject: subject,
        html: composedMail
    });
    const sentedMail = await set_mail_service_1.default.createRecord({
        contactId: contactData.id,
        templateId: mailTemplateId
    });
    return sentedMail;
};
exports.default = {
    sentMail
};
//# sourceMappingURL=index.js.map