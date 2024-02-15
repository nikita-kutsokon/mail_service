import { v5 as uuidv5 } from 'uuid';
import { SentMail } from '@prisma/client';

import prismaClient from '../../../../database/prisma-client';


const createRecord = async (mailData: Omit<SentMail, 'emailId' | 'id' | 'sentDate'>) => {
    const identifierString = `${mailData.contactId}-${mailData.templateId}-${Date.now()}`; 

    const sentedmMail = await prismaClient.sentMail.create({
        data: {
            ...mailData,
            emailId: uuidv5(identifierString, uuidv5.URL)
        }
    });

    return sentedmMail;
}

export default {
    createRecord
}