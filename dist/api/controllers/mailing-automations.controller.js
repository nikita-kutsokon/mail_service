"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const mailing_automations_service_1 = __importDefault(require("../services/mailing-automations.service"));
const exception_interceptor_middleware_1 = __importDefault(require("../middlewares/exception-interceptor.middleware"));
const createMailingAutomation = async (req, res) => {
    const mailingAutomationData = req.body;
    const creationResult = await mailing_automations_service_1.default.createMailingAutomation(mailingAutomationData);
    res.status(http_status_codes_1.StatusCodes.CREATED).json(creationResult);
};
const updateMailingAutomationById = async (req, res) => {
    const id = req.params.id;
    const newMailingAutomationData = req.body;
    const updatedMailingAutomation = await mailing_automations_service_1.default.updateMailingAutomationById(id, newMailingAutomationData);
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedMailingAutomation);
};
const deleteMailingAutomationById = async (req, res) => {
    const id = req.params.id;
    const deletedMailingAutomation = await mailing_automations_service_1.default.deleteMailingAutomationById(id);
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json(deletedMailingAutomation);
};
const getMailingAutomationById = async (req, res) => {
    const id = req.params.id;
    const retrievedMailingAutomationData = await mailing_automations_service_1.default.getMailingAutomationById(id);
    res.status(http_status_codes_1.StatusCodes.OK).json(retrievedMailingAutomationData);
};
const getMailingAutomationsList = async (req, res) => {
    const { search, page, pageSize, sortOrder } = req.query;
    const mailingAutomationsList = await mailing_automations_service_1.default.getMailingAutomationsList({
        search: search || '',
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc'
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(mailingAutomationsList);
};
const addContactsToAutomation = async (req, res) => {
    const id = req.params.id;
    const contactsData = req.body;
    const addingResult = await mailing_automations_service_1.default.addContactsToAutomation(id, contactsData.contactIds);
    res.status(http_status_codes_1.StatusCodes.OK).send(http_status_codes_1.ReasonPhrases.OK);
};
const removeContactsFromAutomation = async (req, res) => {
    const id = req.params.id;
    const contactsData = req.body;
    const removingResult = await mailing_automations_service_1.default.removeContactsFromAutomation(id, contactsData.contactIds);
    res.status(http_status_codes_1.StatusCodes.OK).send(http_status_codes_1.ReasonPhrases.OK);
};
exports.default = {
    createMailingAutomation: (0, exception_interceptor_middleware_1.default)(createMailingAutomation),
    updateMailingAutomationById: (0, exception_interceptor_middleware_1.default)(updateMailingAutomationById),
    deleteMailingAutomationById: (0, exception_interceptor_middleware_1.default)(deleteMailingAutomationById),
    getMailingAutomationById: (0, exception_interceptor_middleware_1.default)(getMailingAutomationById),
    getMailingAutomationsList: (0, exception_interceptor_middleware_1.default)(getMailingAutomationsList),
    addContactsToAutomation: (0, exception_interceptor_middleware_1.default)(addContactsToAutomation),
    removeContactsFromAutomation: (0, exception_interceptor_middleware_1.default)(removeContactsFromAutomation),
};
//# sourceMappingURL=mailing-automations.controller.js.map