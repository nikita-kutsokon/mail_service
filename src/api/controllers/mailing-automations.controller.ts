import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import MailingAutomationsService from '../services/mailing-automations.service';
import ExceptionInterceptor from '../middlewares/exception-interceptor.middleware';

const createMailingAutomation = async (req: Request, res: Response) => {
    const mailingAutomationData = req.body;

    const creationResult = await MailingAutomationsService.createMailingAutomation(mailingAutomationData);

    res.status(StatusCodes.CREATED).json(creationResult);
};

const updateMailingAutomationById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const newMailingAutomationData = req.body;

    const updatedMailingAutomation = await MailingAutomationsService.updateMailingAutomationById(id, newMailingAutomationData);

    res.status(StatusCodes.OK).json(updatedMailingAutomation);
};

const deleteMailingAutomationById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const deletedMailingAutomation = await MailingAutomationsService.deleteMailingAutomationById(id);

    res.status(StatusCodes.NO_CONTENT).json(deletedMailingAutomation);
};

const getMailingAutomationById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const retrievedMailingAutomationData = await MailingAutomationsService.getMailingAutomationById(id);

    res.status(StatusCodes.OK).json(retrievedMailingAutomationData);
};

const getMailingAutomationsList = async (req: Request, res: Response) => {
    const { search, page, pageSize, sortOrder } = req.query as ApiResourceFilteringParams;

    const mailingAutomationsList = await MailingAutomationsService.getMailingAutomationsList({ 
        search: search || '',
        page: Number(page) || 1, 
        pageSize: Number(pageSize) || 10,
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc'
    });

    res.status(StatusCodes.OK).json(mailingAutomationsList);
};

const addContactsToAutomation = async (req: Request, res: Response) => {
    const id = req.params.id;
    const contactsData = req.body;

    const addingResult = await MailingAutomationsService.addContactsToAutomation(id, contactsData.contactIds);

    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

const removeContactsFromAutomation = async (req: Request, res: Response) => {
    const id = req.params.id;
    const contactsData = req.body;

    const removingResult = await MailingAutomationsService.removeContactsFromAutomation(id, contactsData.contactIds);

    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

export default {
    createMailingAutomation: ExceptionInterceptor(createMailingAutomation),
    updateMailingAutomationById: ExceptionInterceptor(updateMailingAutomationById),
    deleteMailingAutomationById: ExceptionInterceptor(deleteMailingAutomationById),
    getMailingAutomationById: ExceptionInterceptor(getMailingAutomationById),
    getMailingAutomationsList: ExceptionInterceptor(getMailingAutomationsList),
    addContactsToAutomation: ExceptionInterceptor(addContactsToAutomation),
    removeContactsFromAutomation: ExceptionInterceptor(removeContactsFromAutomation),
}
