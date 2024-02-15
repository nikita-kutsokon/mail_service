import moment from 'moment';
import { Prisma, Contact } from '@prisma/client';

import MailSenderService from '../../mailing-service/mail-sender';
import ContacService from '../../../api/services/contacts.service';
import LocationDeterminationService from '../../location-determination-service'

import prismaClient from '../../../database/prisma-client';

const applyingInternshipHandler = async (contactData: Prisma.ContactCreateInput, contactIpAddress: string) => {
    try {
        const contactLocation = await LocationDeterminationService.getContactLocationByIpAddress(contactIpAddress);
        const dataAboutContactFromDatabase = await prismaClient.contact.findUnique({ where: { email: contactData.email } });
        
        console.log(contactLocation);

        if (contactLocation && (contactLocation.country === 'Russia' || contactLocation.country === 'Belarus')) {
            const contactRecord = dataAboutContactFromDatabase
                ? await ContacService.updateContactById(dataAboutContactFromDatabase.id, {...contactData, ...contactLocation})
                : await ContacService.createContact({...contactData, ...contactLocation});
            
            return await subscribeToBlockedContactsList(contactRecord, 'From country agressor');
        }
        
        const eqTimestampCalculatedValue = generateEqTimestampFieldBasedOnEqSelectedDate({...contactData, ...contactLocation});

        contactData.ipAddress = contactIpAddress;
        contactData.eduQuestEventTimestamp = eqTimestampCalculatedValue;

        const contactRecord = dataAboutContactFromDatabase
            ? await ContacService.updateContactById(dataAboutContactFromDatabase.id, {...contactData, ...contactLocation})
            : await ContacService.createContact({...contactData, ...contactLocation});

        const listSubscribtionResult = await subscribeToAppropriateList(contactRecord);

        return listSubscribtionResult;
    } catch(error) {
        console.log(error)
    }
};

const subscribeToAppropriateList = async (contactData: Contact) => {
    try {
        
        if (contactData.eduQuestSelectedDateTime === null) {
            return await subscribeToFutureList(contactData);
        }

        return await subscribeToEQList(contactData);
    } catch (e) {
        console.log(e)
    }
};

const subscribeToEQList = async (contactData: Contact) => {
    const subscriptionResult = await prismaClient.contactstList.update({
        where: { eduQuestStartDate: contactData.eduQuestSelectedDateTime },
        data: {
            contacts: { connect: { id: contactData.id } }
        }
    });

    await MailSenderService.sentMail(contactData, '65ba9d47d3ed1c967f8f7483', 'Application submitted');

    return subscriptionResult;
};

const subscribeToFutureList = async (contactData: Contact) => {
    const subscriptionResult = await prismaClient.futureEqDatesContactsList.create({
        data: {
            contact: {
                connect: { id: contactData.id }
            },
        }
    });

    return subscriptionResult;
};

const subscribeToBlockedContactsList = async (contactData: Contact, blockingReason: string) => {
    const subscriptionResult = await prismaClient.blockedContactsList.create({
        data: {
            contact: {
                connect: { id: contactData.id }
            },
            reasonOfBlocking: blockingReason
        }
    });
    // Unsubscribe contact from mailing
    await prismaClient.contact.update({ 
        where: { id: contactData.id },
        data: {
            isSubscribed: false
        } 
    });

    //sent mail stop war

    return subscriptionResult;
};

const generateEqTimestampFieldBasedOnEqSelectedDate = (contactData: Prisma.ContactCreateInput) => {
    if (contactData.eduQuestSelectedDateTime === null) return '';

    const momentDate = moment(contactData.eduQuestSelectedDateTime);
    const formatedDate = momentDate.tz(contactData.timezone).format('MMMM DD, YYYY HH:mm');

    return `${formatedDate} ${contactData.timezone}`;
};

export default applyingInternshipHandler;