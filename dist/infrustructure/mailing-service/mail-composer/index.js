"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const placeholder_replacer_1 = __importDefault(require("./placeholder-replacer"));
const mail_templates_driver_service_1 = __importDefault(require("../../services/google-services/mail-templates.driver-service"));
const prisma_client_1 = __importDefault(require("../../../database/prisma-client"));
const templateMailTextCache = new node_cache_1.default({ stdTTL: 900 });
const composeMail = async (contactData, mailTemplateId) => {
    const mailTemplateText = await getTemplateMailTextByTemplateId(mailTemplateId);
    const formatedMailText = await placeholder_replacer_1.default.replacePlaceholders(mailTemplateText, contactData);
    return formatedMailText;
};
const getTemplateMailTextByTemplateId = async (mailTemplateId) => {
    if (templateMailTextCache.get(mailTemplateId)) {
        return templateMailTextCache.get(mailTemplateId);
    }
    ;
    const mailTemplateData = await prisma_client_1.default.mailTemplate.findUnique({ where: { id: mailTemplateId } });
    const mailTemplateText = await mail_templates_driver_service_1.default.getMailTemplateFileDataById(mailTemplateData.googleDriveFileId);
    templateMailTextCache.set(mailTemplateId, mailTemplateText);
    return mailTemplateText;
};
exports.default = {
    composeMail
};
//# sourceMappingURL=index.js.map