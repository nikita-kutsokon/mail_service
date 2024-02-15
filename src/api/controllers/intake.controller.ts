import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IntakeStatus } from '@prisma/client';
import IntakeService from '../services/intake.service';


const createRecord = async (req: Request, res: Response) => {
    const recordData = req.body;
    const creationResult = await IntakeService.createRecord(recordData);
    
    res.status(StatusCodes.CREATED).json(creationResult);
};

const getRecordById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const targetRecordData = await IntakeService.getRecordById(id);
    
    res.status(StatusCodes.OK).json(targetRecordData);
};

const getRecordsList = async (req: Request, res: Response) => {
    const { page, pageSize, sortOrder, status } = req.query;

    const targetRecords = await IntakeService.getRecordsList({ 
        status: status as IntakeStatus || undefined,
        page: Number(page) || 1, 
        pageSize: Number(pageSize) || 10,
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
    });

    res.status(StatusCodes.OK).json(targetRecords);
};

const delteRecordById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const deletingResult = await IntakeService.delteRecordById(id);

    res.status(StatusCodes.OK).json(deletingResult);
};

const updateRecordById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const newRecordData = req.body;

    const updatingResult = await IntakeService.updateRecordById(id, newRecordData);

    res.status(StatusCodes.OK).json(updatingResult);
};

const getCountrySourceStats = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await IntakeService.getCountrySourceStats(id);

    res.status(StatusCodes.OK).json(result);
};

export default {
    createRecord,
    getRecordById,
    getRecordsList,
    delteRecordById,
    updateRecordById,
    getCountrySourceStats
}