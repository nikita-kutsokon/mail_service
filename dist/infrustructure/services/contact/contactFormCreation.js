"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contacts_service_1 = __importDefault(require("../../../api/services/contacts.service"));
const request_body_validator_1 = __importDefault(require("../../../api/middlewares/request-body-validator"));
const contacts_request_schemas_1 = __importDefault(require("../../../api/request-schemas/contacts.request-schemas"));
const http_status_codes_1 = require("http-status-codes");
const contactLocation_service_1 = require("../../../user-actions-system/services/contactLocation.service");
const router = (0, express_1.Router)();
router.post("/", (0, request_body_validator_1.default)(contacts_request_schemas_1.default.createResourseFormSubmitionForm), async (req, res) => {
    try {
        const contactData = req.body;
        const userIpAddress = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
        const userLocation = await (0, contactLocation_service_1.getLocationByIpAddress)(userIpAddress);
        if (userLocation && (userLocation.country === 'Russia' || userLocation.country === 'Belarus')) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json('It is not possible to create a contact from Russia or Belarus').end();
        }
        const contact = await contacts_service_1.default.createContact({ ...contactData, ...userLocation });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ contact });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=contactFormCreation.js.map