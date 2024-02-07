"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const client_1 = require("@prisma/client");
const prisma_client_1 = __importDefault(require("../../database/prisma-client"));
const createRecord = async (data) => {
    const createdRecord = await prisma_client_1.default.intake.create({ data });
    const createdEqContactList = await prisma_client_1.default.contactstList.create({
        data: {
            name: `Internship ${data.programType === client_1.InternShipProgramType.WEEKDAY ? 'Weekday' : 'Weekend'}: ${(0, moment_1.default)(data.eventDate).utc().format('MMMM D, YYYY, hh:mm A')}`,
            eduQuestStartDate: data.eventDate,
            intake: {
                connect: { id: createdRecord.id }
            }
        }
    });
    return createdRecord;
};
const updateRecordById = async (id, data) => {
    const updatedRecord = await prisma_client_1.default.intake.update({
        where: { id },
        data: data
    });
    return updatedRecord;
};
const delteRecordById = async (id) => {
    const deletedRecord = await prisma_client_1.default.intake.delete({ where: { id } });
    return deletedRecord;
};
const getRecordById = async (id) => {
    const targetRecord = await prisma_client_1.default.intake.findUnique({ where: { id } });
    return targetRecord;
};
const getRecordsList = async (filteringParams) => {
    const { page, pageSize, status } = filteringParams;
    const skip = (page - 1) * pageSize;
    const records = await prisma_client_1.default.intake.findMany({
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
const getCountrySourceStats = async (id) => {
    const targetContactList = await prisma_client_1.default.contactstList.findUnique({ where: { intakeId: id } });
    const result = await prisma_client_1.default.contact.groupBy({
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
exports.default = {
    createRecord,
    getRecordById,
    getRecordsList,
    delteRecordById,
    updateRecordById,
    getCountrySourceStats
};
//# sourceMappingURL=intake.service.js.map