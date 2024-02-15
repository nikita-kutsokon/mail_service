"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const intake_controller_1 = __importDefault(require("../controllers/intake.controller"));
const request_body_validator_1 = __importDefault(require("../middlewares/request-body-validator"));
const request_id_validator_middleware_1 = __importDefault(require("../middlewares/request-id-validator.middleware"));
const intake_request_schemas_1 = __importDefault(require("../request-schemas/intake.request-schemas"));
const router = (0, express_1.Router)();
router.get('/', intake_controller_1.default.getRecordsList);
router.post('/', (0, request_body_validator_1.default)(intake_request_schemas_1.default.createResourse), intake_controller_1.default.createRecord);
router.get('/:id', request_id_validator_middleware_1.default, intake_controller_1.default.getRecordById);
router.put('/:id', request_id_validator_middleware_1.default, (0, request_body_validator_1.default)(intake_request_schemas_1.default.updateResource), intake_controller_1.default.updateRecordById);
router.delete('/:id', request_id_validator_middleware_1.default, intake_controller_1.default.delteRecordById);
router.get('/:id/country-source-stats', request_id_validator_middleware_1.default, intake_controller_1.default.getCountrySourceStats);
exports.default = router;
//# sourceMappingURL=intake.router.js.map