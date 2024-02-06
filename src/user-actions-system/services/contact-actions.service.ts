import prismaClient from '../../database/prisma-client';
import descriptionGenerator from '../helpers/descriptionCreator';
import { ContactsActions } from "@prisma/client";

const emailOpenTracking = async (emailId: string) => {
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
}

const emailLinkTracking = async (emailId: string, linkName: string) => {
    const { templateId, contactId } = await prismaClient.sentMail.findUnique({
        where: {
            emailId
        }
    })
    const activityDescription = await descriptionGenerator.generateDescriptionForLinksActions(templateId, linkName)

    // await prismaClient.contactsActions.create({
    //     data: {
    //         contactId,
    //         typeOfActivity: "LINK",
    //         templateId,
    //         activityDescription
    //     }
    // })
}

const unsubscribe = async (id: string) => {
    await prismaClient.contact.update({ 
        where: {
            id
        },
        data: {
            isSubscribed: false
        }
    })

    // await prismaClient.unsubscribedUsers.create({
    //     data: {
    //         contactId: id,
    //         activityDescription: 'User has unsubscribed'
    //     }
    // })
}

const unsubscribedContactsList = async () => {
    // return await prismaClient.unsubscribedUsers.findMany({})
}

const subscribe = async (id: string) => {
    await prismaClient.contact.update({
        where: {
            id
        },
        data: {
            isSubscribed: true
        }
    })

    // await prismaClient.unsubscribedUsers.delete({
    //     where: {
    //         contactId: id
    //     }
    // })
}

export default {
    emailLinkTracking,
    emailOpenTracking,
    unsubscribe,
    unsubscribedContactsList,
    subscribe
}