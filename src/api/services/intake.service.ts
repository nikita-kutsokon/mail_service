import moment from 'moment';
import { IntakeStatus, InternShipProgramType, Prisma } from '@prisma/client';

import prismaClient from '../../database/prisma-client';

interface IntakeListFilteringParams extends ApiResourceFilteringParams {
    status: IntakeStatus
}

  

const createRecord = async (data: Prisma.IntakeCreateInput) => {
    const createdRecord = await prismaClient.intake.create({ data });

    const createdEqContactList = await prismaClient.contactstList.create({
        data: {
            name: `Internship ${data.programType === InternShipProgramType.WEEKDAY ? 'Weekday' : 'Weekend'}: ${moment(data.eventDate).utc().format('MMMM D, YYYY, hh:mm A')}`,
            eduQuestStartDate: data.eventDate,
            intake: {
                connect: { id: createdRecord.id }
            }
        }
    })

    return createdRecord;
};

const updateRecordById = async (id: string, data: Prisma.IntakeUpdateInput) => {
    const updatedRecord = await prismaClient.intake.update({
        where: { id },
        data: data
    });

    return updatedRecord;
};

const delteRecordById = async (id: string) => {
    const deletedRecord = await prismaClient.intake.delete({ where: { id } });

    return deletedRecord;
};

const getRecordById = async (id: string) => {
    const targetRecord = await prismaClient.intake.findUnique({ where: { id } });

    return targetRecord;
};

const getRecordsList = async (filteringParams: IntakeListFilteringParams) => {
    const { page, pageSize, status } = filteringParams;
    const skip = (page - 1) * pageSize;

    const records = await prismaClient.intake.findMany({
        skip,
        take: pageSize,
        where: {
            status: status || undefined
        }
    });

    return {
        intakes: records, 
        intakesCount: records.length
    };
};

export default {
    createRecord,
    getRecordById,
    getRecordsList,
    delteRecordById,
    updateRecordById,
}