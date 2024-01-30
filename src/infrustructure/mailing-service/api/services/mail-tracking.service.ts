import prismaClient from '../../../../database/prisma-client';
import { createContactAction, ContactActionType } from '../../services/contacts-actions.service';



const setResultOfTrackingLinkToDatabase = async (emailId: string) => {
    const emailId = req.query.emailId as string;
    const linkName = req.query.linkName as string;  

    const { contactId, templateId } = await prismaClient.sentMail.findUnique({ where: { emailId } });

    await createContactAction(contactId, ContactActionType.CLICK_TO_LINK, templateId, visitedLink);

    const redirectLink = linkName === "EduQuest" ? "https://eduquest.nobelexplorers.live" : "https://nobelexplorers.com/nobel-internships"

    await ContactActionsService.emailLinkTracking(emailId, linkName)

    res.redirect(redirectLink)
}