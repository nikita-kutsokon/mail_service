import moment from 'moment';
import { Contact } from '@prisma/client';


const staticPlaceholderHandlers = {
    '%NAME%': (contactData: Contact) => firstNamePlaceholderReplacer(contactData),
    '%SURNAME%': (contactData: Contact) => lastNamePlacehoderReplacer(contactData),
    '%EDUQUEST_TIMESTAMP%': (contactData: Contact) => eqTimestampPlacehoderReplacer(contactData),
    '%EQ_SELECTED_DATE%': (contactData: Contact) => eqSelectedDateTimePlaceholderReplacer(contactData),
};

const lastNamePlacehoderReplacer = (contactData: Contact) => contactData.lastName;

const firstNamePlaceholderReplacer = (contactData: Contact) => contactData.firstName;

const eqTimestampPlacehoderReplacer = (contactData: Contact) => contactData.eduQuestEventTimestamp;

const eqSelectedDateTimePlaceholderReplacer = (contactData: Contact) => {
    return moment(contactData.eduQuestSelectedDateTime).format('MMMM D, YYYY');
};


export default staticPlaceholderHandlers;