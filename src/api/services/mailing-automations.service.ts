import { Prisma } from '@prisma/client';
import prismaClient from '../../database/prisma-client';

import BaseApiError from '../../utils/http-errors'; 


const createMailingAutomation = async (mailingAutomationData: Prisma.MailingAutomationCreateInput) => {
    const { automationScheduledMails, ...automationData } = mailingAutomationData;
    const result = await prismaClient.mailingAutomation.create({ 
        data: {
            ...automationData,
            automationScheduledMails: {
                createMany: {
                    data: automationScheduledMails as Prisma.AutomationScheduledMailCreateManyInput
                }
            }
        }
        
    });

    return result;
};

const updateMailingAutomationById = async (id: string, mailingAutomationData: Prisma.MailingAutomationUpdateInput) => {
    const { automationScheduledMails: recivedAutomationScheduledMails, ...recivedAutomationData } = mailingAutomationData;

    const targetAutomationScheduledMails = await prismaClient.automationScheduledMail.findMany({ where: { mailingAutomationId: id } });

    const automationScheduledMailsToCreate = (recivedAutomationScheduledMails as any[]).filter(mail => !mail.id);
    const automationScheduledMailsToUpdate = (recivedAutomationScheduledMails as any[]).filter(mail => mail.id);
    const automationScheduledMailsToDelete = targetAutomationScheduledMails
        .filter(targetMail => !(recivedAutomationScheduledMails as any[]).some(mail => targetMail.id === mail.id));

    const result = await prismaClient.mailingAutomation.update({
        where: { id },
        data: {
            ...recivedAutomationData,
            automationScheduledMails: {
                create: automationScheduledMailsToCreate,
                update: automationScheduledMailsToUpdate.map(({ id, templateId, mailingAutomationId, ...data }) => ({
                    where: { id },
                    data: {
                      ...data,
                      template: { connect: { id: templateId } },
                    },
                  })),
                delete: automationScheduledMailsToDelete.map(({ id }) => ({ id: id })),
            },
        },
    });

    return result;
};

const deleteMailingAutomationById = async (id: string) => {
    const result = await prismaClient.mailingAutomation.delete({
        where: { id }
    });

    return result;
};

const getMailingAutomationById = async (id: string) => {
    const result = prismaClient.mailingAutomation.findUnique({
        where: { id },
        include: {
            automationScheduledMails: true
        }
    });

    if (!result) {
        throw BaseApiError.NotFound(`The requested resource with id - ${id} could not be found on the server`);
    }

    return result;
};

const getMailingAutomationsList = async (filteringParams: ApiResourceFilteringParams) => {
    const { search, page, pageSize, sortOrder } = filteringParams;
    const skip = (page - 1) * pageSize;

    const result = await prismaClient.mailingAutomation.findMany({
        skip,
        take: pageSize,
        where: {
            name: { 
                contains: search 
            }
        },
        include: {
            automationScheduledMails: {
                include: {
                    template: true
                }
            }
        }, 
        orderBy: {
            createdAt: sortOrder
        }
    });

    return result;
};

const addContactsToAutomation = async (mailingAutomationId: string, contactIds: string[]) => {
    const targetAutomationDetails = await prismaClient.mailingAutomation.findUnique({ 
        where: { id: mailingAutomationId }, 
        include: { automationScheduledMails: true }
    });

    const automationScheduledMails = targetAutomationDetails.automationScheduledMails;

    for (const targetContactId of contactIds) {
        const scheduledMailsForContact = automationScheduledMails.map(({id, ...scheduledMailData}) => {
            return {
                contactId: targetContactId,
                ...scheduledMailData,
                mailingAutomationId
            };
        });

        await prismaClient.scheduledMail.createMany({ data: scheduledMailsForContact });
        await prismaClient.contactMailingAutomation.create({
            data: {
                contact: { connect: { id: targetContactId} },
                mailingAutomation: { connect: { id: mailingAutomationId } }
            }
        });
    }
};

const removeContactsFromAutomation = async (mailingAutomationId: string, contactIds: string[]) => {
    const removingResult = await prismaClient.scheduledMail.deleteMany({ 
        where: { 
            contactId: { in: contactIds },
            mailingAutomationId: mailingAutomationId 
        }
    });

    return removingResult;
};

export default {
    createMailingAutomation,
    updateMailingAutomationById,
    deleteMailingAutomationById,
    getMailingAutomationById,
    getMailingAutomationsList,
    addContactsToAutomation,
    removeContactsFromAutomation
};