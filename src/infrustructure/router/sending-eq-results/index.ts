import moment from 'moment';
import { EduQuestDecision } from '@prisma/client';

import eqDecisionTemplatesConfig from './config';
import prismaClient from '../../../database/prisma-client';

type eqEventType = 'MAIN' | 'BACKUP';

interface ContactEqDecision {
    contactEmail: string;
    eduQuestDecision: EduQuestDecision;
}

interface EqDecisionsData {
    eventType: eqEventType;
    contactsDecisions: ContactEqDecision[];
};

const processContactsEqDecision = async ({ eventType, contactsDecisions }: EqDecisionsData) => {
    const groupedContactIdsByEqDecisions = await getGroupedContactsIdsByEduQuestDecision(contactsDecisions);

    const updatingDecisionResult = await updateContactsEqDecisons(groupedContactIdsByEqDecisions);
    const scheduledDesicionMailsResult = await scheduleMailsWithEqDecisions(eventType, groupedContactIdsByEqDecisions);
    // const unsubscribtionSelectedContactsResult = await unsibscibeSelectedContactsFromMailing()

    return scheduledDesicionMailsResult;
};

const scheduleMailsWithEqDecisions = async (eventType: eqEventType, groupedContactsIdsByEduQuestDecision: Record<string, string[]>) => {
    const scheduledMailsResult = await Promise.all(
        Object.entries(groupedContactsIdsByEduQuestDecision).map(async ([eduQuestDecisionString, contactIds]) => {
            const eduQuestDecision = eduQuestDecisionString as EduQuestDecision;
            
            const targetTemplateId = eqDecisionTemplatesConfig[`${eventType}_${eduQuestDecision}`];

            const recordsToCreate = contactIds.map(contactId => {
                return {
                    contactId: contactId,
                    useContactTimezone: false,
                    templateId: targetTemplateId,
                    scheduledDate: moment.utc().format(),
                };
            });

            console.log(recordsToCreate.length);

            await prismaClient.scheduledMail.createMany({ data: recordsToCreate });
        })
    );

    return scheduledMailsResult;
};

const updateContactsEqDecisons = async (groupedContactsIdsByEduQuestDecision: Record<string, string[]>) => {
    const updatingResult = await Promise.all(
        Object.entries(groupedContactsIdsByEduQuestDecision).map(async ([eduQuestDecisionString, contactIds]) => {
            const eduQuestDecision = eduQuestDecisionString as EduQuestDecision;

            await prismaClient.contact.updateMany({
                where: { id: { in: contactIds } },
                data: { eduQuestDecision },
            });
        })
    );

    return updatingResult;
};

const unsibscibeSelectedContactsFromMailing = async (groupedContactsIdsByEduQuestDecision: Record<string, string[]>) => {
    const targetContactsids = groupedContactsIdsByEduQuestDecision[EduQuestDecision.SELECTED];

    const updatingResults = await prismaClient.contact.updateMany({
        where: {
            id: { in: targetContactsids }
        },
        data: {
            isSubscribed: false
        }
    });

    return updatingResults;
};


const getGroupedContactsIdsByEduQuestDecision = async (data: ContactEqDecision[]): Promise<Record<string, string[]>> => {
    const result: Record<string, string[]> = {};

    for (const { contactEmail, eduQuestDecision } of data) {
        if (!result[eduQuestDecision]) {
            result[eduQuestDecision] = [];
        }

        const contact = await prismaClient.contact.findUnique({ where: { email: contactEmail } });
        if (contact && contact.id) {
            result[eduQuestDecision].push(contact.id);
        }
    }

    console.log(result);

    return result;
};

export default processContactsEqDecision;