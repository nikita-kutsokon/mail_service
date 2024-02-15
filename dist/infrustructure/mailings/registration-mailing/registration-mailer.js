"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const mail_manager_1 = __importDefault(require("../mail-manager"));
const mail_composer_service_1 = __importDefault(require("../../services/mail/mail-composer.service"));
const setMail = async (contactData) => {
    const composedMail = await mail_composer_service_1.default.composeMail(contactData, config_1.usedTemplates.applicationSubmitedTemplate);
    const modifiedComposedMail = replacePlaceHolders(composeMail);
    await mail_manager_1.default.sentMail(contactData.email, modifiedComposedMail);
};
const replacePlaceHolders = (originalMil) => {
    return '';
};
const composeMail = async () => {
};
//# sourceMappingURL=registration-mailer.js.map