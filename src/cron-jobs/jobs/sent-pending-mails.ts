import moment from 'moment';

import ContactDataService from '../services/contactData';
import ScheduledMailsService from '../services/scheduled-mails.service';

import MailSender from '../../infrustructure/mailing-service/mail-sender';
import { ScheduledMail } from '@prisma/client';

const MESSAGES_PER_MOMENT = Number(process.env.MESSAGES_PER_MOMENT);

const sentPendingMails = async () => {
    const pendingMails = (await ScheduledMailsService.retrievePendingMails()).slice(0, 10);

    for (let i = 0; i < pendingMails.length; i += MESSAGES_PER_MOMENT) {
        const batchOfPendingMails = pendingMails.slice(i, i + MESSAGES_PER_MOMENT);
        console.log(batchOfPendingMails);

        batchOfPendingMails.forEach(async (processedSheduledMailData) => {
            const { contactId, id, templateId, useContactTimezone, mailingAutomationId,  ...restOfFields } = processedSheduledMailData;
            const contactData = await ContactDataService.retrieveContactData(contactId);
            
            if (isTimeToSendMail(processedSheduledMailData) && contactData.isSubscribed) {
                await MailSender.sentMail(contactData, templateId);
                await ScheduledMailsService.deletePendingMail(id);
            }
        });

        console.log('finish batching sending');
    }
};

const isTimeToSendMail = (scheduledMailData: ScheduledMail) => {
    const { scheduledDate } = scheduledMailData;
    
    return moment.utc().isSameOrAfter(scheduledDate);
}

export default sentPendingMails;