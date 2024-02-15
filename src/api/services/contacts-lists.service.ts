import { Prisma } from '@prisma/client';
import prismaClient from '../../database/prisma-client';

import generateEqTimestampFieldBasedOnEqSelectedDate from '../../utils/helpers/dynamic-fields-generators/timestamp.generator';


const createContactsList = async (contactListData: Prisma.ContactstListCreateInput) => {
    const result = await prismaClient.contactstList.create({ data: contactListData });
    return result;
};

const updateContactListById = async (id: string, contactsListData: Prisma.ContactstListUpdateInput) => {
    const result = await prismaClient.contactstList.update({
        where: { id },
        data: contactsListData,
        select: {
            id: true,
            name: true,
            eduQuestStartDate: true,
            createdAt: true
        }
    },);

    return result;
};

const deleteContactsListById = async (id: string) => {
    const result = await prismaClient.contactstList.delete({ where: { id } });
    return result;
};

const getListContactsLists = async (filteringParams: ApiResourceFilteringParams) => {
    const { page, pageSize, sortOrder } = filteringParams;
    const skip = (page - 1) * pageSize;

    const listOfContactsLists = await prismaClient.contactstList.findMany({
        skip,
        take: pageSize,
        include: {
            contacts: true
        },
        orderBy: {
            createdAt: sortOrder
        }
    });

    return (await listOfContactsLists).map(list => ({
        ...list,
        contactsCount: list.contactIds.length,
        contactIds: undefined,
        contacts: undefined
    }));
};

const addContacListToMailingAutomation = async (listId: string, mailingAutomationId: string) => {
    const { contactIds } = await prismaClient.contactstList.findUnique({ 
        where: { id: listId } 
    });
    
    const { automationScheduledMails } = await prismaClient.mailingAutomation.findUnique({ 
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

    await prismaClient.scheduledMail.createMany({ data: scheduledMailsForContacts });

    const connectData = contactIds.map(contactId => ({
        contactId,
        mailingAutomationId
    }));
    
    const result = await prismaClient.contactMailingAutomation.createMany({ data: connectData });

    return result;
};

const syncMembersEqDate = async (listId: string) => {
    const { contactIds, eduQuestStartDate: listEqData } = await prismaClient.contactstList.findUnique({ where: { id: listId } });

    const contactData = await prismaClient.contact.findMany({ where: { id: { in: contactIds } } });

    const recordsToUpdate = contactData.map(targetContactData => ({
        where: { id: targetContactData.id },
        data: {
            eduQuestSelectedDateTime: listEqData,
            eduQuestEventTimestamp: generateEqTimestampFieldBasedOnEqSelectedDate(targetContactData)
        }
    }));

    const result = await prismaClient.contact.updateMany({ data: recordsToUpdate });

    return result;
};

export default {
    createContactsList,
    updateContactListById,
    deleteContactsListById,
    getListContactsLists,
    addContacListToMailingAutomation,
    syncMembersEqDate
};