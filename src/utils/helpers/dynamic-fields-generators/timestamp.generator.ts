import moment from 'moment';
import { Prisma } from '@prisma/client';

const generateEqTimestampFieldBasedOnEqSelectedDate = (contactData: Prisma.ContactCreateInput) => {
    if (contactData.eduQuestSelectedDateTime === null) return '';

    const momentDate = moment(contactData.eduQuestSelectedDateTime);
    const formatedDate = momentDate.tz(contactData.timezone).format('MMMM DD, YYYY HH:mm');

    return `${formatedDate} ${contactData.timezone}`;
};

export default generateEqTimestampFieldBasedOnEqSelectedDate;