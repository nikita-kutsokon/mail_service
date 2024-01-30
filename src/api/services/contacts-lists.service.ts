import { Prisma } from '@prisma/client';
import prismaClient from '../../database/prisma-client';


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
    const list = await prismaClient.contactstList.findUnique({
        where: { id: id },
      });

    const updateListsPromises = list.contactIds.map(contactId =>
        prismaClient.contact.update({
          where: { id: contactId},
          data: { lists: { disconnect: { id: id } } }
        })
      );
      await Promise.all(updateListsPromises);

    const result = await prismaClient.contactstList.delete({ where: { id } });
    return result;
};

const getListContactsLists = async (filteringParams: ApiResourceFilteringParams) => {
    const { page, pageSize } = filteringParams;
    const skip = (page - 1) * pageSize;

    const listOfContactsLists = await prismaClient.contactstList.findMany({
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
    
    await prismaClient.contactMailingAutomation.createMany({ data: connectData });
};

export default {
    createContactsList,
    updateContactListById,
    deleteContactsListById,
    getListContactsLists,
    addContacListToMailingAutomation
};