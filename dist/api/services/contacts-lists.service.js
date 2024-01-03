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
exports.default = {
    createContactsList,
    updateContactListById,
    deleteContactsListById,
    getListContactsLists,
};
//# sourceMappingURL=contacts-lists.service.js.map