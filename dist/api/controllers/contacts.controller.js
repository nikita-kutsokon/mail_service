"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const contacts_service_1 = __importDefault(require("../services/contacts.service"));
const exception_interceptor_middleware_1 = __importDefault(require("../middlewares/exception-interceptor.middleware"));
const createContact = async (req, res) => {
    const contactData = req.body;
    const createdContact = await contacts_service_1.default.createContact(contactData);
    res.status(http_status_codes_1.StatusCodes.CREATED).send(http_status_codes_1.ReasonPhrases.CREATED);
};
const getContactById = async (req, res) => {
    const id = req.params.id;
    const retrivedContactData = await contacts_service_1.default.getContactById(id);
    res.status(http_status_codes_1.StatusCodes.OK).json(retrivedContactData);
};
const deleteContactById = async (req, res) => {
    const id = req.params.id;
    const deletedContact = await contacts_service_1.default.deleteContactById(id);
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json(deletedContact);
};
const updateContactById = async (req, res) => {
    const id = req.params.id;
    const contactData = req.body;
    const updatedContactData = await contacts_service_1.default.updateContactById(id, contactData);
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedContactData);
};
const getContactList = async (req, res) => {
    const { search = '', page = 1, pageSize = 10 } = req.query;
    const result = await contacts_service_1.default.getContactList({ page, pageSize, search });
    res.status(http_status_codes_1.StatusCodes.OK).json(result);
};
const batchUpdatingContacts = async (req, res) => {
    const updatingData = req.body;
    const updatingResult = await contacts_service_1.default.batchUpdatingContacts(updatingData);
    res.status(http_status_codes_1.StatusCodes.OK).send(http_status_codes_1.ReasonPhrases.OK);
};
const batchDeletingContacts = async (req, res) => {
    const deletingData = req.body;
    const deletingResult = await contacts_service_1.default.batchDeletingContacts(deletingData);
    res.status(http_status_codes_1.StatusCodes.OK).send(http_status_codes_1.ReasonPhrases.OK);
};
exports.default = {
    createContact: (0, exception_interceptor_middleware_1.default)(createContact),
    getContactById: (0, exception_interceptor_middleware_1.default)(getContactById),
    getContactList: (0, exception_interceptor_middleware_1.default)(getContactList),
    deleteContactById: (0, exception_interceptor_middleware_1.default)(deleteContactById),
    updateContactById: (0, exception_interceptor_middleware_1.default)(updateContactById),
    batchUpdatingContacts: (0, exception_interceptor_middleware_1.default)(batchUpdatingContacts),
    batchDeletingContacts: (0, exception_interceptor_middleware_1.default)(batchDeletingContacts)
};
//# sourceMappingURL=contacts.controller.js.map