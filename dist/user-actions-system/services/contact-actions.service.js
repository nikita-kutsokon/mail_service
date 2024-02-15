"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../../database/prisma-client"));
const descriptionCreator_1 = __importDefault(require("../helpers/descriptionCreator"));
const emailOpenTracking = async (emailId) => {
    // const {contactId, templateId} = await prismaClient.sentMail.update({
    //     where: {
    //         emailId
    //     },
    //     data: {
    //         emailStatus: "OPENED"
    //     }
    // })
    // const activityDescription = await descriptionGenerator.generateDescriptionForEmailsActions(templateId)
    // await prismaClient.contactsActions.create({
    //     data: {
    //         contactId,
    //         typeOfActivity: "EMAIL",
    //         templateId,
    //         activityDescription
    //     }
    // })
};
const emailLinkTracking = async (emailId, linkName) => {
    const { templateId, contactId } = await prisma_client_1.default.sentMail.findUnique({
        where: {
            emailId
        }
    });
    const activityDescription = await descriptionCreator_1.default.generateDescriptionForLinksActions(templateId, linkName);
    // await prismaClient.contactsActions.create({
    //     data: {
    //         contactId,
    //         typeOfActivity: "LINK",
    //         templateId,
    //         activityDescription
    //     }
    // })
};
const unsubscribe = async (id) => {
    await prisma_client_1.default.contact.update({
        where: {
            id
        },
        data: {
            isSubscribed: false
        }
    });
    // await prismaClient.unsubscribedUsers.create({
    //     data: {
    //         contactId: id,
    //         activityDescription: 'User has unsubscribed'
    //     }
    // })
};
const unsubscribedContactsList = async () => {
    // return await prismaClient.unsubscribedUsers.findMany({})
};
const subscribe = async (id) => {
    await prisma_client_1.default.contact.update({
        where: {
            id
        },
        data: {
            isSubscribed: true
        }
    });
    // await prismaClient.unsubscribedUsers.delete({
    //     where: {
    //         contactId: id
    //     }
    // })
};
exports.default = {
    emailLinkTracking,
    emailOpenTracking,
    unsubscribe,
    unsubscribedContactsList,
    subscribe
};
//# sourceMappingURL=contact-actions.service.js.map