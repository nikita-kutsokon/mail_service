"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const placeholder_replacer_1 = __importDefault(require("../../mailing-service/mail-composer/placeholder-replacer"));
const prisma_client_1 = __importDefault(require("../../../database/prisma-client"));
const mail_templates_driver_service_1 = __importDefault(require("../google-services/mail-templates.driver-service"));
const templateMailTextCache = new node_cache_1.default({ stdTTL: 900 });
const placeholderMapCollectionCache = new node_cache_1.default({ stdTTL: 900 });
templateMailTextCache.flushAll();
placeholderMapCollectionCache.flushAll();
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
const replacePlaceholders = async (mailText, contactData) => {
    const contactDataplaceholderRegex = /%(\w+)%/g;
    const placeholdersData = await getMapCollectionOfContactPlaceholders();
    const formatedMailText = mailText.replace(contactDataplaceholderRegex, (match, placeholder) => {
        const targetContactField = placeholdersData.get(match);
        return placeholdersData.get(match) && contactData.hasOwnProperty(targetContactField)
            ? contactData[targetContactField]
            : match;
    });
    return formatedMailText;
};
const getMapCollectionOfContactPlaceholders = async () => {
    if (placeholderMapCollectionCache.get('mapCollectionOfContactPlaceholders')) {
        return placeholderMapCollectionCache.get('mapCollectionOfContactPlaceholders');
    }
    const mapCollection = new Map();
    const placeholdersData = await prisma_client_1.default.contactDataPlacehodelr.findMany();
    for (const data of placeholdersData) {
        const { placeholderTag, contactFieldName } = data;
        mapCollection.set(placeholderTag, contactFieldName);
    }
    placeholderMapCollectionCache.set('mapCollectionOfContactPlaceholders', mapCollection);
    return mapCollection;
};
exports.default = {
    composeMail
};
//# sourceMappingURL=mail-composer.service.js.map