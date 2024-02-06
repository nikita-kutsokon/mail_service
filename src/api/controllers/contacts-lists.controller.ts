import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import ContactsListsService from '../services/contacts-lists.service';
import ExceptionInterceptor from '../middlewares/exception-interceptor.middleware';

const createContactsList = async (req: Request, res: Response) => {
    const contactsListData = req.body;
    const result = await ContactsListsService.createContactsList(contactsListData);

    res.status(StatusCodes.CREATED).json(result);
};

const updateContactListById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const contactsListData = req.body;
    const result = await ContactsListsService.updateContactListById(id, contactsListData);
    
    res.status(StatusCodes.OK).json(result);
};

const deleteContactsListById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ContactsListsService.deleteContactsListById(id);

    res.status(StatusCodes.NO_CONTENT).json(result);
};

const getListContactsLists = async (req: Request, res: Response) => {
    const { page, pageSize } = req.query;
    const result = await ContactsListsService.getListContactsLists({ 
        page: Number(page) || 1, 
        pageSize: Number(pageSize) || 10
    }); 

    res.status(StatusCodes.OK).json(result)
};

const addContacListToMailingAutomation = async (req: Request, res: Response) => {
    const listid = '65b2cb4d9f9f640b8b5baa64';
    const  automationId = '65b9fe185ae823c8a92559d9'; 
    console.log(automationId)

    const result = await ContactsListsService.addContacListToMailingAutomation(listid, automationId);

    res.status(StatusCodes.OK).send(result);
}

export default {
    createContactsList: ExceptionInterceptor(createContactsList),
    updateContactListById: ExceptionInterceptor(updateContactListById),
    deleteContactsListById: ExceptionInterceptor(deleteContactsListById),
    getListContactsLists: ExceptionInterceptor(getListContactsLists),
    addContacListToMailingAutomation: ExceptionInterceptor(addContacListToMailingAutomation)
};