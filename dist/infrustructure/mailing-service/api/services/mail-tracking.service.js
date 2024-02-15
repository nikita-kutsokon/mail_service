"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../../../../database/prisma-client"));
const contacts_actions_service_1 = require("../../services/contacts-actions.service");
const setResultOfTrackingLinkToDatabase = async (emailId) => {
    const linkName = '';
    const visitedLink = '';
    const { contactId, templateId } = await prisma_client_1.default.sentMail.findUnique({ where: { emailId } });
    await (0, contacts_actions_service_1.createContactAction)(contactId, contacts_actions_service_1.ContactActionType.CLICK_TO_LINK, templateId, visitedLink);
    const redirectLink = linkName === "EduQuest" ? "https://eduquest.nobelexplorers.live" : "https://nobelexplorers.com/nobel-internships";
    // await ContactActionsService.emailLinkTracking(emailId, linkName)
    // res.redirect(redirectLink)
};
//# sourceMappingURL=mail-tracking.service.js.map