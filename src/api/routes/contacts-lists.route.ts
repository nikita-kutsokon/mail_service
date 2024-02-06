import { Router } from 'express';

import isValidId from '../middlewares/request-id-validator.middleware';
import validateBody from '../middlewares/request-body-validator';

import contactsListsSchema from '../request-schemas/contacts-lists.request-schemas';

import ContactsListsController from '../controllers/contacts-lists.controller';


const router = Router();

router.get(
    '/',
    ContactsListsController.getListContactsLists 
);

router.post(
    '/',
    validateBody(contactsListsSchema.createResourseSchema),
    ContactsListsController.createContactsList 
);

router.put(
    '/:id', 
    isValidId,
    validateBody(contactsListsSchema.updateResourseSchema),
    ContactsListsController.updateContactListById
);

router.post(
    '/:id/add-to-automation/:automationId', 
    isValidId,
    ContactsListsController.addContacListToMailingAutomation
)

router.delete(
    '/:id',
    isValidId,
    ContactsListsController.deleteContactsListById 
);

export default router;