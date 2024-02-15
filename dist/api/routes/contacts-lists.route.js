"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const request_id_validator_middleware_1 = __importDefault(require("../middlewares/request-id-validator.middleware"));
const request_body_validator_1 = __importDefault(require("../middlewares/request-body-validator"));
const contacts_lists_request_schemas_1 = __importDefault(require("../request-schemas/contacts-lists.request-schemas"));
const contacts_lists_controller_1 = __importDefault(require("../controllers/contacts-lists.controller"));
const router = (0, express_1.Router)();
router.get('/', contacts_lists_controller_1.default.getListContactsLists);
router.post('/', (0, request_body_validator_1.default)(contacts_lists_request_schemas_1.default.createResourseSchema), contacts_lists_controller_1.default.createContactsList);
router.put('/:id', request_id_validator_middleware_1.default, (0, request_body_validator_1.default)(contacts_lists_request_schemas_1.default.updateResourseSchema), contacts_lists_controller_1.default.updateContactListById);
router.post('/add-to-automation', contacts_lists_controller_1.default.addContacListToMailingAutomation);
router.post('/:id/sync-members-eq-date', contacts_lists_controller_1.default.addContacListToMailingAutomation);
router.delete('/:id', request_id_validator_middleware_1.default, contacts_lists_controller_1.default.deleteContactsListById);
exports.default = router;
//# sourceMappingURL=contacts-lists.route.js.map