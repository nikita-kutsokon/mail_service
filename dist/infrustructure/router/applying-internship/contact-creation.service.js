"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const mailing_service_1 = __importDefault(require("../../mailing-service"));
const contacts_service_1 = __importDefault(require("../../../api/services/contacts.service"));
const location_determination_service_1 = __importDefault(require("../../location-determination-service"));
const prisma_client_1 = __importDefault(require("../../../database/prisma-client"));
const applyingInternshipHandler = async (contactData, contactIpAddress) => {
    try {
        const contactLocation = await location_determination_service_1.default.getContactLocationByIpAddress(contactIpAddress);
        const dataAboutContactFromDatabase = await prisma_client_1.default.contact.findUnique({ where: { email: contactData.email } });
        console.log(contactLocation);
        if (contactLocation && (contactLocation.country === 'Russia' || contactLocation.country === 'Belarus')) {
            const contactRecord = dataAboutContactFromDatabase
                ? await contacts_service_1.default.updateContactById(dataAboutContactFromDatabase.id, { ...contactData, ...contactLocation })
                : await contacts_service_1.default.createContact({ ...contactData, ...contactLocation });
            return await subscribeToBlockedContactsList(contactRecord, 'From country agressor');
        }
        const eqTimestampCalculatedValue = generateEqTimestampFieldBasedOnEqSelectedDate({ ...contactData, ...contactLocation });
        contactData.ipAddress = contactIpAddress;
        contactData.eduQuestEventTimestamp = eqTimestampCalculatedValue;
        const contactRecord = dataAboutContactFromDatabase
            ? await contacts_service_1.default.updateContactById(dataAboutContactFromDatabase.id, { ...contactData, ...contactLocation })
            : await contacts_service_1.default.createContact({ ...contactData, ...contactLocation });
        const listSubscribtionResult = await subscribeToAppropriateList(contactRecord);
        return listSubscribtionResult;
    }
    catch (error) {
        console.log(error);
    }
};
const subscribeToAppropriateList = async (contactData) => {
    try {
        if (contactData.eduQuestSelectedDateTime === null) {
            return await subscribeToFutureList(contactData);
        }
        return await subscribeToEQList(contactData);
    }
    catch (e) {
        console.log(e);
    }
};
const subscribeToEQList = async (contactData) => {
    const subscriptionResult = await prisma_client_1.default.contactstList.update({
        where: { eduQuestStartDate: contactData.eduQuestSelectedDateTime },
        data: {
            contacts: { connect: { id: contactData.id } }
        }
    });
    await mailing_service_1.default.sentMail(contactData, '65ba9d47d3ed1c967f8f7483', 'Application submitted');
    return subscriptionResult;
};
const subscribeToFutureList = async (contactData) => {
    const subscriptionResult = await prisma_client_1.default.futureEqDatesContactsList.create({
        data: {
            contact: {
                connect: { id: contactData.id }
            },
        }
    });
    return subscriptionResult;
};
const subscribeToBlockedContactsList = async (contactData, blockingReason) => {
    const subscriptionResult = await prisma_client_1.default.blockedContactsList.create({
        data: {
            contact: {
                connect: { id: contactData.id }
            },
            reasonOfBlocking: blockingReason
        }
    });
    // Unsubscribe contact from mailing
    await prisma_client_1.default.contact.update({
        where: { id: contactData.id },
        data: {
            isSubscribed: false
        }
    });
    //sent mail stop war
    return subscriptionResult;
};
const generateEqTimestampFieldBasedOnEqSelectedDate = (contactData) => {
    if (contactData.eduQuestSelectedDateTime === null)
        return '';
    const momentDate = (0, moment_1.default)(contactData.eduQuestSelectedDateTime);
    const formatedDate = momentDate.tz(contactData.timezone).format('MMMM DD, YYYY HH:mm');
    return `${formatedDate} ${contactData.timezone}`;
};
exports.default = applyingInternshipHandler;
//# sourceMappingURL=contact-creation.service.js.map