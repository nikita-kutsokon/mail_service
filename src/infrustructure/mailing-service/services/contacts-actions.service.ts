import NodeCache from 'node-cache';

import prismaClient from '../../../database/prisma-client';
import { MailTemplate } from '@prisma/client';


export enum ContactActionType {
    CLICK_TO_LINK,
    SUBSCRIBE_TO_MAILING,
    UNSUBSCRIBE_FROM_MAILING
};

const cachedTemplateData = new NodeCache({ stdTTL: 3000 });

export const createContactAction = async (
    contactId: string, 
    actionType: ContactActionType, 
    targetTemplateId?: string, 
    visitedWebsiteLink?: string
) => {
    switch (actionType) {
        case ContactActionType.SUBSCRIBE_TO_MAILING: {
            await setActionToDatabase(contactId, `Contact was subscribet to mailing`);
            break;
        }
        case ContactActionType.UNSUBSCRIBE_FROM_MAILING: {
            await setActionToDatabase(contactId, `Contact was unsubscribe from mailing`);
            break;
        }
        case ContactActionType.CLICK_TO_LINK: {
            const targetTemplate = await getTemplateDataById(targetTemplateId);
            await setActionToDatabase(contactId, `Contact was clicked to link: ${visitedWebsiteLink}\nIn ${targetTemplate.name} template`);
            break;
        }
        default: {
            throw new Error('Uknown contact action type');
        }
    }
};

const getTemplateDataById = async (templateId: string) => {
    if (cachedTemplateData.get(templateId)) {
        return cachedTemplateData.get(templateId) as MailTemplate;
    }
    
    const templateData = prismaClient.mailTemplate.findUnique({ where: { id: templateId } });

    cachedTemplateData.set(templateId, templateData);

    return templateData;
}


const setActionToDatabase = async (contactId: string, actionDescription: string) => {
    await prismaClient.contactsActions.create({ 
        data: {
            contactId,
            actionDescription
        } 
    });
};
