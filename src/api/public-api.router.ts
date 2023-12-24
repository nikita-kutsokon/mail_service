import { Router } from 'express';

import AuthenticateMiddleware from './middlewares/authenticate';

import ContactRouter from './routes/contacts.router';
import ContactListRouter from './routes/contacts-lists.route';
import MailingTemplateRouter from './routes/mail-templates.route';
import ScheduledMailRouter from './routes/scheduled-mails.router';
import MailingAutomationRouter from './routes/mailing-automations.router';

const router = Router();

// router.use(AuthenticateMiddleware);

router.use('/contacts', ContactRouter);
router.use('/contact-lists', ContactListRouter);
router.use('/scheduled-mails', ScheduledMailRouter);
router.use('/mail-templates', MailingTemplateRouter);
router.use('/mailing-automations', MailingAutomationRouter);

export default router;