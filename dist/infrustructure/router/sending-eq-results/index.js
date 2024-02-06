"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const prisma_client_1 = __importDefault(require("../../../database/prisma-client"));
;
const handleEqResultsForContacts = async ({ eventType, contactsDecisions }) => {
    const groupedContactIdsByEqDecisions = await getGroupedContactsIdsByEduQuestDecision(contactsDecisions);
    const updatingDecisionResult = await updateContactsEqDecisons(groupedContactIdsByEqDecisions);
    //TODO: maybe this call is sync with code above
    const scheduledDesicionMailsResult = await scheduleMailsWithEqDecisions(eventType, groupedContactIdsByEqDecisions);
};
const scheduleMailsWithEqDecisions = async (eventType, groupedContactsIdsByEduQuestDecision) => {
    await Promise.all(Object.entries(groupedContactsIdsByEduQuestDecision).map(async ([eduQuestDecisionString, contactIds]) => {
        const eduQuestDecision = eduQuestDecisionString;
        const targetTemplateId = config_1.default[`${eventType}_${eduQuestDecision}`];
        const recordsToCreate = contactIds.map(contactId => {
            return {
                contactId: contactId,
                useContactTimezone: false,
                templateId: targetTemplateId,
                scheduledDate: Date.now().toString(),
            };
        });
        await prisma_client_1.default.scheduledMail.createMany({ data: recordsToCreate });
    }));
};
const updateContactsEqDecisons = async (groupedContactsIdsByEduQuestDecision) => {
    await Promise.all(Object.entries(groupedContactsIdsByEduQuestDecision).map(async ([eduQuestDecisionString, contactIds]) => {
        const eduQuestDecision = eduQuestDecisionString;
        await prisma_client_1.default.contact.updateMany({
            where: { id: { in: contactIds } },
            data: { eduQuestDecision },
        });
    }));
};
const getGroupedContactsIdsByEduQuestDecision = async (data) => {
    const result = data.reduce(async (acc, { contactEmail, eduQuestDecision }) => {
        if (!acc[eduQuestDecision]) {
            acc[eduQuestDecision] = [];
        }
        const { id } = await prisma_client_1.default.contact.findUnique({ where: { email: contactEmail } });
        acc[eduQuestDecision].push(id);
        return acc;
    }, {});
    return result;
};
//# sourceMappingURL=index.js.map