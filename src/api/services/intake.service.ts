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
    const { page, pageSize, sortOrder, status } = filteringParams;
    const skip = (page - 1) * pageSize;

    const records = await prismaClient.intake.findMany({
        skip,
        take: pageSize,
        where: {
            status: status || undefined
        },
        orderBy: {
            createdAt: sortOrder
        }
    });

    return {
        intakes: records, 
        intakesCount: records.length
    };
};

const getCountrySourceStats = async (id: string) => {
    const targetContactList = await prismaClient.contactstList.findUnique({ where: { intakeId: id } });    

    const result = await prismaClient.contact.groupBy({
        by: ['country', 'sourceOfReferral'], 
        where: { 
            listIds: { has: targetContactList.id } 
        },
        _count: {
            _all: true
        }
    });

    const transformedResult = result.reduce((acc, curr) => {
        const countryName = curr.country;
        const sourceName = curr.sourceOfReferral;
        const countOfInterns = curr._count._all;

        if (!acc[countryName]) {
            acc[countryName] = {
                referalSources: {},
                internsCount: 0
            };
        }

        acc[countryName].referalSources[sourceName] = countOfInterns;
        acc[countryName].internsCount += countOfInterns;

        return acc;
    }, {});

    return transformedResult;
};

export default {
    createRecord,
    getRecordById,
    getRecordsList,
    delteRecordById,
    updateRecordById,
    getCountrySourceStats
};