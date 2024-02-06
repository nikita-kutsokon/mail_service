import { Prisma } from '@prisma/client';
import prismaClient from '../../database/prisma-client';

interface CreateRecodType {
    id?: string;
    emailId: string;
    scheduledDate: string | Date;
    contactId: string
    templateId: string;
}

const createRecord = async (data: CreateRecodType) => {
    const createdRecord = await prismaClient.sentMail.create({ data: data });

    return createdRecord;
}

export default {
    createRecord
}