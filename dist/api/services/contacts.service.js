"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../../database/prisma-client"));
const contacts_list_subscription_1 = require("../helpers/contacts-list-subscription");
const generate_timestamp_1 = require("../helpers/generate-timestamp");
const createContact = async (contactData) => {
    try {
        const isContactExist = await prisma_client_1.default.contact.findUnique({ where: { email: contactData.email } });
        if (!isContactExist) {
            const eduQuestEventTimestamp = (0, generate_timestamp_1.generateTimestampField)(contactData.timezone, contactData.eduQuestSelectedDateTime);
            const contact = await prisma_client_1.default.contact.create({ data: { ...contactData, eduQuestEventTimestamp } });
            const subscriptionResult = await (0, contacts_list_subscription_1.subscribeToRelevantList)(contact);
            return subscriptionResult;
        }
        else {
            const eduQuestEventTimestamp = (0, generate_timestamp_1.generateTimestampField)(contactData.timezone, contactData.eduQuestSelectedDateTime);
            const updatedContact = await updateContactById(isContactExist.id, { ...contactData, eduQuestEventTimestamp });
            const subscriptionResult = await (0, contacts_list_subscription_1.subscribeToRelevantList)({ ...updatedContact, eduQuestSelectedDateTime: contactData.eduQuestSelectedDateTime });
            return subscriptionResult;
        }
    }
    catch (error) {
        console.log(error);
    }
};
const deleteContactById = async (id) => {
    const contact = await prisma_client_1.default.contact.findUnique({
        where: { id: id },
        include: { lists: true }
    });
    const updateListsPromises = contact.listIds.map(list => prisma_client_1.default.contactstList.update({
        where: { id: list },
        data: { contacts: { disconnect: { id: id } } }
    }));
    await Promise.all(updateListsPromises);
    const result = await prisma_client_1.default.contact.delete({
        where: { id: id }
    });
    return result;
};
const updateContactById = async (id, contactData) => {
    const result = await prisma_client_1.default.contact.update({ where: { id }, data: contactData });
    return result;
};
const getContactById = async (id) => {
    const result = await prisma_client_1.default.contact.findUnique({ where: { id } });
    return result;
};
const getContactList = async (filteringParams) => {
    const { search, page, pageSize, listIds } = filteringParams;
    const skip = (page - 1) * pageSize;
    const conditions = [];
    if (search) {
        conditions.push({
            OR: [
                { email: { contains: search } },
                { firstName: { contains: search } },
                { lastName: { contains: search } },
            ],
        });
    }
    if (listIds && listIds.length > 0) {
        conditions.push({ listIds: { hasSome: listIds } });
    }
    const whereCondition = {
        AND: conditions,
    };
    const contacts = await prisma_client_1.default.contact.findMany({
        skip,
        take: pageSize,
        where: whereCondition
    });
    const contactsCount = await prisma_client_1.default.contact.count({
        where: whereCondition,
    });
    return {
        contacts,
        contactsCount
    };
};
const batchUpdatingContacts = async (updatingData) => {
    const { contactIds, updates } = updatingData;
    if (updates.eduQuestSelectedDateTime) {
        const existingContacts = await prisma_client_1.default.contact.findMany({
            where: {
                id: {
                    in: contactIds,
                },
            },
        });
        const updatedContacts = await Promise.all(existingContacts.map(async (contact) => {
            const eduQuestEventTimestamp = (0, generate_timestamp_1.generateTimestampField)(contact.timezone, updates.eduQuestSelectedDateTime);
            const updatedContact = await updateContactById(contact.id, { ...updates, eduQuestEventTimestamp });
            return updatedContact;
        }));
        return updatedContacts;
    }
    const result = await prisma_client_1.default.contact.updateMany({
        where: {
            id: {
                in: contactIds,
            },
        },
        data: updates,
    });
    return result;
};
const batchDeletingContacts = async (deletingData) => {
    const result = await prisma_client_1.default.contact.deleteMany({
        where: {
            id: {
                in: deletingData.contactIds,
            },
        },
    });
    return result;
};
const getContactActions = async (contactId, typeOfActivity) => {
    // const objectQuery = typeOfActivity ? { contactId, typeOfActivity: { equals: typeOfActivity as ContactsActions["typeOfActivity"] } } : { contactId };
    // return await prismaClient.contactsActions.findMany({
    //     where: objectQuery
    // })
};
exports.default = {
    createContact,
    getContactById,
    getContactList,
    deleteContactById,
    updateContactById,
    batchUpdatingContacts,
    batchDeletingContacts,
    getContactActions
};
//# sourceMappingURL=contacts.service.js.map