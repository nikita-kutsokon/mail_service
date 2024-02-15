const nodemailer = require('nodemailer');
import { Contact } from '@prisma/client';

import gmailClientConfig from './config';

import MailComposer from '../mail-composer';
import SentMailsService from './services/sent-mail.service';


const transporter = nodemailer.createTransport(gmailClientConfig);

const sentMail = async (contactData: Contact, mailTemplateId: string, subject: string = 'Eduquest event') => {
    const composedMail = await MailComposer.composeMail(contactData, mailTemplateId);

    await transporter.sendMail({
        to: contactData.email,
        subject: subject,
        html: composedMail
    });

    const sentedMail = await SentMailsService.createRecord({ 
        contactId: contactData.id, 
        templateId: mailTemplateId 
    });

    return sentedMail;
};

export default {
    sentMail
}