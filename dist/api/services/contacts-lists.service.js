"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../../database/prisma-client"));
const createContactsList = async (contactListData) => {
    const result = await prisma_client_1.default.contactstList.create({ data: contactListData });
    return result;
};
const updateContactListById = async (id, contactsListData) => {
    const result = await prisma_client_1.default.contactstList.update({
        where: { id },
        data: contactsListData,
        select: {
            id: true,
            name: true,
            eduQuestStartDate: true,
            createdAt: true
        }
    });
    return result;
};
const deleteContactsListById = async (id) => {
    const result = await prisma_client_1.default.contactstList.delete({ where: { id } });
    return result;
};
const getListContactsLists = async (filteringParams) => {
    const { page, pageSize } = filteringParams;
    const skip = (page - 1) * pageSize;
    const listOfContactsLists = await prisma_client_1.default.contactstList.findMany({
        skip,
        take: pageSize,
        include: {
            contacts: true
        }
    });
    return (await listOfContactsLists).map(list => ({
        ...list,
        contactsCount: list.contactIds.length,
        contactIds: undefined,
        contacts: undefined
    }));
};
const addContacListToMailingAutomation = async (listId, mailingAutomationId) => {
    const { contactIds } = await prisma_client_1.default.contactstList.findUnique({
        where: { id: listId }
    });
    const { automationScheduledMails } = await prisma_client_1.default.mailingAutomation.findUnique({
        where: { id: mailingAutomationId },
        include: { automationScheduledMails: true }
    });
    const scheduledMailsForContacts = contactIds.map(contactId => {
        return automationScheduledMails.map(({ id, ...scheduledMailData }) => ({
            contactId,
            mailingAutomationId,
            ...scheduledMailData
        }));
    }).flat();
    await prisma_client_1.default.scheduledMail.createMany({ data: scheduledMailsForContacts });
    const connectData = contactIds.map(contactId => ({
        contactId,
        mailingAutomationId
    }));
    const result = await prisma_client_1.default.contactMailingAutomation.createMany({ data: connectData });
    return result;
};
exports.default = {
    createContactsList,
    updateContactListById,
    deleteContactsListById,
    getListContactsLists,
    addContacListToMailingAutomation
};
//# sourceMappingURL=contacts-lists.service.js.map