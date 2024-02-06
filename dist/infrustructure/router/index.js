"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_creation_service_1 = __importDefault(require("./applying-internship/contact-creation.service"));
const router = (0, express_1.default)();
router.post('/contact-form-creation', async (req, res) => {
    const contactData = req.body;
    const userIpAddress = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
    const result = await (0, contact_creation_service_1.default)(contactData, userIpAddress);
    res.status(200).send('OK');
});
exports.default = router;
//# sourceMappingURL=index.js.map