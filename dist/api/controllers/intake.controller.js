"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const intake_service_1 = __importDefault(require("../services/intake.service"));
const createRecord = async (req, res) => {
    const recordData = req.body;
    const creationResult = await intake_service_1.default.createRecord(recordData);
    res.status(http_status_codes_1.StatusCodes.CREATED).json(creationResult);
};
const getRecordById = async (req, res) => {
    const id = req.params.id;
    const targetRecordData = await intake_service_1.default.getRecordById(id);
    res.status(http_status_codes_1.StatusCodes.OK).json(targetRecordData);
};
const getRecordsList = async (req, res) => {
    const { page, pageSize, sortOrder, status } = req.query;
    const targetRecords = await intake_service_1.default.getRecordsList({
        status: status || undefined,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(targetRecords);
};
const delteRecordById = async (req, res) => {
    const id = req.params.id;
    const deletingResult = await intake_service_1.default.delteRecordById(id);
    res.status(http_status_codes_1.StatusCodes.OK).json(deletingResult);
};
const updateRecordById = async (req, res) => {
    const id = req.params.id;
    const newRecordData = req.body;
    const updatingResult = await intake_service_1.default.updateRecordById(id, newRecordData);
    res.status(http_status_codes_1.StatusCodes.OK).json(updatingResult);
};
const getCountrySourceStats = async (req, res) => {
    const id = req.params.id;
    const result = await intake_service_1.default.getCountrySourceStats(id);
    res.status(http_status_codes_1.StatusCodes.OK).json(result);
};
exports.default = {
    createRecord,
    getRecordById,
    getRecordsList,
    delteRecordById,
    updateRecordById,
    getCountrySourceStats
};
//# sourceMappingURL=intake.controller.js.map