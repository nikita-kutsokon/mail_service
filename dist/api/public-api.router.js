"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const intake_router_1 = __importDefault(require("./routes/intake.router"));
const contacts_router_1 = __importDefault(require("./routes/contacts.router"));
const contacts_lists_route_1 = __importDefault(require("./routes/contacts-lists.route"));
const mail_templates_route_1 = __importDefault(require("./routes/mail-templates.route"));
const scheduled_mails_router_1 = __importDefault(require("./routes/scheduled-mails.router"));
const mailing_automations_router_1 = __importDefault(require("./routes/mailing-automations.router"));
const router = (0, express_1.Router)();
// router.use(AuthenticateMiddleware);
router.use('/intakes', intake_router_1.default);
router.use('/contacts', contacts_router_1.default);
router.use('/contacts-lists', contacts_lists_route_1.default);
router.use('/scheduled-mails', scheduled_mails_router_1.default);
router.use('/mail-templates', mail_templates_route_1.default);
router.use('/mailing-automations', mailing_automations_router_1.default);
exports.default = router;
//# sourceMappingURL=public-api.router.js.map