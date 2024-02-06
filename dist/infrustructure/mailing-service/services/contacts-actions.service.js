"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactAction = exports.ContactActionType = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const prisma_client_1 = __importDefault(require("../../../database/prisma-client"));
var ContactActionType;
(function (ContactActionType) {
    ContactActionType[ContactActionType["CLICK_TO_LINK"] = 0] = "CLICK_TO_LINK";
    ContactActionType[ContactActionType["SUBSCRIBE_TO_MAILING"] = 1] = "SUBSCRIBE_TO_MAILING";
    ContactActionType[ContactActionType["UNSUBSCRIBE_FROM_MAILING"] = 2] = "UNSUBSCRIBE_FROM_MAILING";
})(ContactActionType || (exports.ContactActionType = ContactActionType = {}));
;
const cachedTemplateData = new node_cache_1.default({ stdTTL: 3000 });
const createContactAction = async (contactId, actionType, targetTemplateId, visitedWebsiteLink) => {
    switch (actionType) {
        case ContactActionType.SUBSCRIBE_TO_MAILING: {
            await setActionToDatabase(contactId, `Contact was subscribet to mailing`);
            break;
        }
        case ContactActionType.UNSUBSCRIBE_FROM_MAILING: {
            await setActionToDatabase(contactId, `Contact was unsubscribe from mailing`);
            break;
        }
        case ContactActionType.CLICK_TO_LINK: {
            const targetTemplate = await getTemplateDataById(targetTemplateId);
            await setActionToDatabase(contactId, `Contact was clicked to link: ${visitedWebsiteLink}\nIn ${targetTemplate.name} template`);
            break;
        }
        default: {
            throw new Error('Uknown contact action type');
        }
    }
};
exports.createContactAction = createContactAction;
const getTemplateDataById = async (templateId) => {
    if (cachedTemplateData.get(templateId)) {
        return cachedTemplateData.get(templateId);
    }
    const templateData = prisma_client_1.default.mailTemplate.findUnique({ where: { id: templateId } });
    cachedTemplateData.set(templateId, templateData);
    return templateData;
};
const setActionToDatabase = async (contactId, actionDescription) => {
    await prisma_client_1.default.contactsActions.create({
        data: {
            contactId,
            actionDescription
        }
    });
};
//# sourceMappingURL=contacts-actions.service.js.map