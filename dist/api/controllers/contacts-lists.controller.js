"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const contacts_lists_service_1 = __importDefault(require("../services/contacts-lists.service"));
const exception_interceptor_middleware_1 = __importDefault(require("../middlewares/exception-interceptor.middleware"));
const createContactsList = async (req, res) => {
    const contactsListData = req.body;
    const result = await contacts_lists_service_1.default.createContactsList(contactsListData);
    res.status(http_status_codes_1.StatusCodes.CREATED).json(result);
};
const updateContactListById = async (req, res) => {
    const id = req.params.id;
    const contactsListData = req.body;
    const result = await contacts_lists_service_1.default.updateContactListById(id, contactsListData);
    res.status(http_status_codes_1.StatusCodes.OK).json(result);
};
const deleteContactsListById = async (req, res) => {
    const id = req.params.id;
    const result = await contacts_lists_service_1.default.deleteContactsListById(id);
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json(result);
};
const getListContactsLists = async (req, res) => {
    const { page, pageSize, sortOrder } = req.query;
    const result = await contacts_lists_service_1.default.getListContactsLists({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc'
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(result);
};
const addContacListToMailingAutomation = async (req, res) => {
    const listid = '65b2cb4d9f9f640b8b5baa64';
    const automationId = '65b9fe185ae823c8a92559d9';
    console.log(automationId);
    const result = await contacts_lists_service_1.default.addContacListToMailingAutomation(listid, automationId);
    res.status(http_status_codes_1.StatusCodes.OK).send(result);
};
exports.default = {
    createContactsList: (0, exception_interceptor_middleware_1.default)(createContactsList),
    updateContactListById: (0, exception_interceptor_middleware_1.default)(updateContactListById),
    deleteContactsListById: (0, exception_interceptor_middleware_1.default)(deleteContactsListById),
    getListContactsLists: (0, exception_interceptor_middleware_1.default)(getListContactsLists),
    addContacListToMailingAutomation: (0, exception_interceptor_middleware_1.default)(addContacListToMailingAutomation)
};
//# sourceMappingURL=contacts-lists.controller.js.map