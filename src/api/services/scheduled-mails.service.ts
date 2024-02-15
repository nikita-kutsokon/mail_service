import moment from 'moment-timezone';
import { Prisma } from '@prisma/client';

import prismaClient from '../../database/prisma-client';
import BaseApiError from '../../utils/http-errors'; 

const createMails = async (mailData: Prisma.ScheduledMailCreateManyInput) => {
    
    if (mailData.useContactTimezone) {
        const { scheduledDate, contactId } = mailData;
        const { timezone: contactTimezone } = await prismaClient.contact.findUnique({ where: { id: contactId } });
        
        const utcTime = moment.utc();
        const scheduledMoment = moment(scheduledDate).utc();

        const contactTimezoneOffsetInMinutes = utcTime.tz(contactTimezone).utcOffset();
        const adjustedScheduledDateTime = scheduledMoment.subtract(contactTimezoneOffsetInMinutes, 'minutes').toDate();

        mailData.scheduledDate = adjustedScheduledDateTime;
    }

    const result = await prismaClient.scheduledMail.create({ data: mailData });
    
    return result;
};

const getMailById = async (id: string) => {
    const result = await prismaClient.scheduledMail.findUnique({ where: { id } });

    if (!result) {
        throw BaseApiError.NotFound(`The requested resource with id - ${id} could not be found on the server`);
    }

    return result;
};

const deleteMailById = async (id: string) => {
    const result = await prismaClient.scheduledMail.delete({ where: { id } });
    return result;
};

const updateMailById = async (id: string, mailData: Prisma.ScheduledMailUpdateInput) => {
    const result = await prismaClient.scheduledMail.update({ where: { id }, data: mailData });
    return result;
};

const getMailsList = async () => {
    const result = await prismaClient.scheduledMail.findMany();
    return result;
};

const getPendingMails = async () => {
    const currentDateTimeUTC = moment.utc().toDate();
    
    const pendingMails = await prismaClient.scheduledMail.findMany({
        where: {
            scheduledDate: {
                lt: currentDateTimeUTC
            }
        }
    });

    return pendingMails;
};


export default {
    createMails,
    getMailById,
    deleteMailById,
    updateMailById,
    getMailsList,
    getPendingMails
};