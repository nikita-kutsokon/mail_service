import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import ContactService from '../services/contacts.service';
import ExceptionInterceptor from '../middlewares/exception-interceptor.middleware';


export const createContact = async (req: Request, res: Response) => {
  try {
    const contactData = req.body;
    
    const contact = await ContactService.createContact({...contactData });
    res.status(StatusCodes.CREATED).json({contact});
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};

const getContactById =async (req:Request,res:Response)=>{
    const id=req.params.id;

    const retrivedContactData = await ContactService.getContactById(id);

    res.status(StatusCodes.OK).json(retrivedContactData);
};

const deleteContactById = async (req:Request,res:Response) => {
    const id= req.params.id;

    const deletedContact= await ContactService.deleteContactById(id);
    
    res.status(StatusCodes.NO_CONTENT).json(deletedContact);
};

const updateContactById= async(req:Request,res:Response)=>{
    const id=req.params.id;
    const contactData=req.body;

    const updatedContactData=await ContactService.updateContactById(id,contactData);

    res.status(StatusCodes.OK).json(updatedContactData);
};

const getContactList = async (req: Request, res: Response) => {
    const { search, page, pageSize, sortOrder, listIds } = req.query;

    const result = await ContactService.getContactList({ 
        search: search as string || '',
        page: Number(page) || 1, 
        pageSize: Number(pageSize) || 10,
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
        listIds: Array.isArray(listIds) ? listIds as string[] : (typeof listIds === 'string' ? [listIds] : [])
    });

    res.status(StatusCodes.OK).json(result);
};

const batchUpdatingContacts = async (req: Request, res: Response) => {
    const updatingData = req.body;

    const updatingResult = await ContactService.batchUpdatingContacts(updatingData);

    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

const batchDeletingContacts = async (req: Request, res: Response) => {
    const deletingData = req.body;

    const deletingResult = await ContactService.batchDeletingContacts(deletingData);

    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

const getContactActions = async(req: Request, res: Response) => {
    const { id } = req.params
    const typeOfActivity = typeof req.query.typeOfActivity === 'string' ? req.query.typeOfActivity : null;

    const userActions = await ContactService.getContactActions(id, typeOfActivity)

    res.status(200).json({
        userActions
    })
}

export default {
    createContact: ExceptionInterceptor(createContact),
    getContactById: ExceptionInterceptor(getContactById),
    getContactList: ExceptionInterceptor(getContactList),
    deleteContactById: ExceptionInterceptor(deleteContactById),
    updateContactById: ExceptionInterceptor(updateContactById),
    batchUpdatingContacts: ExceptionInterceptor(batchUpdatingContacts),
    batchDeletingContacts: ExceptionInterceptor(batchDeletingContacts),
    getContactActions: ExceptionInterceptor(getContactActions)
};