import prismaClient from '../../../../database/prisma-client';
import { createContactAction, ContactActionType } from '../../services/contacts-actions.service';

const subscribeContactToMailing = async (emailId: string) => {
    const { contactId } = await prismaClient.sentMail.findUnique({ where: { emailId } });

    const updatedContactData = await prismaClient.contact.update({ 
        where: { id: contactId },
        data: { isSubscribed: true }
    });

    await createContactAction(contactId, ContactActionType.SUBSCRIBE_TO_MAILING);

    return updatedContactData;
};

const unsubscribeContactFromMailing = async (emailId: string) => {
    const { contactId } = await prismaClient.sentMail.findUnique({ where: { emailId } });

    const updatedContactData = await prismaClient.contact.update({ 
        where: { id: contactId },
        data: { isSubscribed: false }
    });

    await createContactAction(contactId, ContactActionType.UNSUBSCRIBE_FROM_MAILING);

    return updatedContactData;
};

export default {
    subscribeContactToMailing,
    unsubscribeContactFromMailing
};