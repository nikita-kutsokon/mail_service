
import ContactDataService from '../services/contactData'
import SendedMailsService from '../services/sended-mails'
import ScheduledMailsService from '../services/scheduled-mails.service';

// import MailSender from '../../infrustructure/services/mail/mail-sender.service';
// import MailComposer from '../../infrustructure/services/mail/mail-composer.service';
import MailTimeCoordinator from '../../infrustructure/services/mail/mail-time-coordinator.service';
import modifyEmailTextWithUniqueValues from '../../user-actions-system/helpers/uniqueEmailDecorator';
import MailService from '../../infrustructure/mailing-service';

const MESSAGES_PER_MOMENT = Number(process.env.MESSAGES_PER_MOMENT);

const sentPendingMails = async () => {
    const pendingMails = (await ScheduledMailsService.retrievePendingMails()).slice(0, 10);

    for (let i = 0; i < pendingMails.length; i += MESSAGES_PER_MOMENT) {
        const batchOfPendingMails = pendingMails.slice(i, i + MESSAGES_PER_MOMENT);
        console.log(batchOfPendingMails);

        batchOfPendingMails.forEach(async (processedSheduledMailData) => {
            const { contactId, id, templateId, useContactTimezone, mailingAutomationId,  ...restOfFields } = processedSheduledMailData;
            const contactData = await ContactDataService.retrieveContactData(contactId);
            
            if (MailTimeCoordinator.isTimeToSendMail(processedSheduledMailData) && contactData.isSubscribed) {
                
                // const composedMail = await MailComposer.composeMail(contactData, templateId);
                // const composedIdentifiedMail = modifyEmailTextWithUniqueValues(composedMail, {contactId, emailId: id})

                // await MailSender.sentComposedMail(contactData.email, composedIdentifiedMail);
                await MailService.sentMail(contactData, templateId);
                await ScheduledMailsService.deletePendingMail(id);
                // await SendedMailsService.addSendedMail({emailId: id, contactId, templateId, ...restOfFields});
            }
        });

        console.log('finish batching sending');
    }
};

export default sentPendingMails;