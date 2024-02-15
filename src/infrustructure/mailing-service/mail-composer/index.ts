import NodeCache from 'node-cache';
import { Contact } from '@prisma/client';

import PlaceholderReplacer from './placeholder-replacer';
import MailTemplatesGoogleDriveSerive from '../../google-services/google-drive/services/mail-templates.google-service';

import prismaClient from '../../../database/prisma-client';


const templateMailTextCache = new NodeCache({ stdTTL: 900 });

const composeMail  = async (contactData: Contact, mailTemplateId: string) => {
    const mailTemplateText = await getTemplateMailTextByTemplateId(mailTemplateId);
    const formatedMailText = await PlaceholderReplacer.replacePlaceholders(mailTemplateText, contactData);

    return formatedMailText
};

const getTemplateMailTextByTemplateId = async (mailTemplateId: string): Promise<string> => {
    if (templateMailTextCache.get(mailTemplateId)) {
        return templateMailTextCache.get(mailTemplateId);
    };

    const mailTemplateData = await prismaClient.mailTemplate.findUnique({ where: { id: mailTemplateId } });
    const mailTemplateText = await MailTemplatesGoogleDriveSerive.getMailTemplateFileDataById(mailTemplateData.googleDriveFileId);

    templateMailTextCache.set(mailTemplateId, mailTemplateText);

    return mailTemplateText;
};

export default {
    composeMail
};