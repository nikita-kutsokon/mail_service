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

const handleEqResultsForContacts = async ({ eventType, contactsDecisions }: EqDecisionsData) => {
    const groupedContactIdsByEqDecisions = await getGroupedContactsIdsByEduQuestDecision(contactsDecisions);

    const updatingDecisionResult = await updateContactsEqDecisons(groupedContactIdsByEqDecisions);
    //TODO: maybe this call is sync with code above
    const scheduledDesicionMailsResult = await scheduleMailsWithEqDecisions(eventType, groupedContactIdsByEqDecisions);

    
};

const scheduleMailsWithEqDecisions = async (eventType: eqEventType, groupedContactsIdsByEduQuestDecision: Record<string, string[]>) => {
    await Promise.all(
        Object.entries(groupedContactsIdsByEduQuestDecision).map(async ([eduQuestDecisionString, contactIds]) => {
            const eduQuestDecision = eduQuestDecisionString as EduQuestDecision;
            const targetTemplateId = eqDecisionTemplatesConfig[`${eventType}_${eduQuestDecision}`];

            const recordsToCreate = contactIds.map(contactId => {
                return {
                    contactId: contactId,
                    useContactTimezone: false,
                    templateId: targetTemplateId,
                    scheduledDate: Date.now().toString(),
                };
            });

            await prismaClient.scheduledMail.createMany({ data: recordsToCreate });
        })
    );
};

const updateContactsEqDecisons = async (groupedContactsIdsByEduQuestDecision: Record<string, string[]>) => {
    await Promise.all(
        Object.entries(groupedContactsIdsByEduQuestDecision).map(async ([eduQuestDecisionString, contactIds]) => {
            const eduQuestDecision = eduQuestDecisionString as EduQuestDecision;

            await prismaClient.contact.updateMany({
                where: { id: { in: contactIds } },
                data: { eduQuestDecision },
            });
        })
    );
};

const getGroupedContactsIdsByEduQuestDecision = async (data: ContactEqDecision[]): Promise<Record<string, string[]>> => {
    const result = data.reduce(async (acc, { contactEmail, eduQuestDecision }) => {
        if (!acc[eduQuestDecision]) {
            acc[eduQuestDecision] = [];
        }

        const { id } = await prismaClient.contact.findUnique({ where: { email: contactEmail } });
        acc[eduQuestDecision].push(id);

        return acc;
    }, {});

    return result;
};