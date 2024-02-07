"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../../database/prisma-client"));
const http_errors_1 = __importDefault(require("../../utils/http-errors"));
const createMailingAutomation = async (mailingAutomationData) => {
    const { automationScheduledMails, ...automationData } = mailingAutomationData;
    const result = await prisma_client_1.default.mailingAutomation.create({
        data: {
            ...automationData,
            automationScheduledMails: {
                createMany: {
                    data: automationScheduledMails
                }
            }
        }
    });
    return result;
};
const updateMailingAutomationById = async (id, mailingAutomationData) => {
    const { automationScheduledMails: recivedAutomationScheduledMails, ...recivedAutomationData } = mailingAutomationData;
    const targetAutomationScheduledMails = await prisma_client_1.default.automationScheduledMail.findMany({ where: { mailingAutomationId: id } });
    const automationScheduledMailsToCreate = recivedAutomationScheduledMails.filter(mail => !mail.id);
    const automationScheduledMailsToUpdate = recivedAutomationScheduledMails.filter(mail => mail.id);
    const automationScheduledMailsToDelete = targetAutomationScheduledMails
        .filter(targetMail => !recivedAutomationScheduledMails.some(mail => targetMail.id === mail.id));
    const result = await prisma_client_1.default.mailingAutomation.update({
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
const deleteMailingAutomationById = async (id) => {
    const result = await prisma_client_1.default.mailingAutomation.delete({
        where: { id }
    });
    return result;
};
const getMailingAutomationById = async (id) => {
    const result = prisma_client_1.default.mailingAutomation.findUnique({
        where: { id },
        include: {
            automationScheduledMails: true
        }
    });
    if (!result) {
        throw http_errors_1.default.NotFound(`The requested resource with id - ${id} could not be found on the server`);
    }
    return result;
};
const getMailingAutomationsList = async (filteringParams) => {
    const { search, page, pageSize, sortOrder } = filteringParams;
    const skip = (page - 1) * pageSize;
    const result = await prisma_client_1.default.mailingAutomation.findMany({
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
const addContactsToAutomation = async (mailingAutomationId, contactIds) => {
    const targetAutomationDetails = await prisma_client_1.default.mailingAutomation.findUnique({
        where: { id: mailingAutomationId },
        include: { automationScheduledMails: true }
    });
    const automationScheduledMails = targetAutomationDetails.automationScheduledMails;
    for (const targetContactId of contactIds) {
        const scheduledMailsForContact = automationScheduledMails.map(({ id, ...scheduledMailData }) => {
            return {
                contactId: targetContactId,
                ...scheduledMailData,
                mailingAutomationId
            };
        });
        await prisma_client_1.default.scheduledMail.createMany({ data: scheduledMailsForContact });
        await prisma_client_1.default.contactMailingAutomation.create({
            data: {
                contact: { connect: { id: targetContactId } },
                mailingAutomation: { connect: { id: mailingAutomationId } }
            }
        });
    }
};
const removeContactsFromAutomation = async (mailingAutomationId, contactIds) => {
    const removingResult = await prisma_client_1.default.scheduledMail.deleteMany({
        where: {
            contactId: { in: contactIds },
            mailingAutomationId: mailingAutomationId
        }
    });
    return removingResult;
};
exports.default = {
    createMailingAutomation,
    updateMailingAutomationById,
    deleteMailingAutomationById,
    getMailingAutomationById,
    getMailingAutomationsList,
    addContactsToAutomation,
    removeContactsFromAutomation
};
//# sourceMappingURL=mailing-automations.service.js.map