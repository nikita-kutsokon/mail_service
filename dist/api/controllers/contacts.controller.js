"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const http_status_codes_1 = require("http-status-codes");
const contacts_service_1 = __importDefault(require("../services/contacts.service"));
const exception_interceptor_middleware_1 = __importDefault(require("../middlewares/exception-interceptor.middleware"));
const createContact = async (req, res) => {
    try {
        const contactData = req.body;
        const contact = await contacts_service_1.default.createContact({ ...contactData });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ contact });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};
exports.createContact = createContact;
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
    const { search, page, pageSize, sortOrder, listIds } = req.query;
    const result = await contacts_service_1.default.getContactList({
        search: search || '',
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
        listIds: Array.isArray(listIds) ? listIds : (typeof listIds === 'string' ? [listIds] : [])
    });
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
const getContactActions = async (req, res) => {
    const { id } = req.params;
    const typeOfActivity = typeof req.query.typeOfActivity === 'string' ? req.query.typeOfActivity : null;
    const userActions = await contacts_service_1.default.getContactActions(id, typeOfActivity);
    res.status(200).json({
        userActions
    });
};
exports.default = {
    createContact: (0, exception_interceptor_middleware_1.default)(exports.createContact),
    getContactById: (0, exception_interceptor_middleware_1.default)(getContactById),
    getContactList: (0, exception_interceptor_middleware_1.default)(getContactList),
    deleteContactById: (0, exception_interceptor_middleware_1.default)(deleteContactById),
    updateContactById: (0, exception_interceptor_middleware_1.default)(updateContactById),
    batchUpdatingContacts: (0, exception_interceptor_middleware_1.default)(batchUpdatingContacts),
    batchDeletingContacts: (0, exception_interceptor_middleware_1.default)(batchDeletingContacts),
    getContactActions: (0, exception_interceptor_middleware_1.default)(getContactActions)
};
//# sourceMappingURL=contacts.controller.js.map