"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../../../../database/prisma-client"));
const contacts_actions_service_1 = require("../../services/contacts-actions.service");
const subscribeContactToMailing = async (emailId) => {
    const { contactId } = await prisma_client_1.default.sentMail.findUnique({ where: { emailId } });
    const updatedContactData = await prisma_client_1.default.contact.update({
        where: { id: contactId },
        data: { isSubscribed: true }
    });
    await (0, contacts_actions_service_1.createContactAction)(contactId, contacts_actions_service_1.ContactActionType.SUBSCRIBE_TO_MAILING);
    return updatedContactData;
};
const unsubscribeContactFromMailing = async (emailId) => {
    const { contactId } = await prisma_client_1.default.sentMail.findUnique({ where: { emailId } });
    const updatedContactData = await prisma_client_1.default.contact.update({
        where: { id: contactId },
        data: { isSubscribed: false }
    });
    await (0, contacts_actions_service_1.createContactAction)(contactId, contacts_actions_service_1.ContactActionType.UNSUBSCRIBE_FROM_MAILING);
    return updatedContactData;
};
exports.default = {
    subscribeContactToMailing,
    unsubscribeContactFromMailing
};
//# sourceMappingURL=contacts-subscription.service.js.map