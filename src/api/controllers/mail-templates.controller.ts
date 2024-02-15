import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import ExceptionInterceptor from '../middlewares/exception-interceptor.middleware';
import MailTemplatesService from '../services/mail-templates.service';

const createMailTemplates = async (req: Request, res: Response) => {
    if (!req.files) {
        return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    }

    await MailTemplatesService.createMailTemplates(req.files)
    res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED)
};

const getMailTemplateDataById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const templateData = await MailTemplatesService.getMailTemplateDataById(id);

    res.status(StatusCodes.OK).send(templateData);
};

const updateMailTemplateDataById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body.data;

    const updatedTemplateData = await MailTemplatesService.updateMailTemplateDataById(id, data);

    res.status(StatusCodes.OK).end();
};

const deleteMailTemplateById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await MailTemplatesService.deleteMailTemplateById(id);

    res.status(StatusCodes.OK).json(result);
};

const getMailTemplatesList = async (req: Request, res: Response) => {
    const { page, pageSize, sortOrder } = req.query;
    const result = await MailTemplatesService.getMailTemplatesList({ 
        page: Number(page) || 1, 
        pageSize: Number(pageSize) || 10,
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc'
    });    

    res.status(StatusCodes.OK).json(result);
};

export default {
    createMailTemplates: ExceptionInterceptor(createMailTemplates),
    getMailTemplatesList: ExceptionInterceptor(getMailTemplatesList),
    deleteMailTemplateById: ExceptionInterceptor(deleteMailTemplateById),
    getMailTemplateDataById: ExceptionInterceptor(getMailTemplateDataById),
    updateMailTemplateDataById: ExceptionInterceptor(updateMailTemplateDataById)
};