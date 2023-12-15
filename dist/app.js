"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const prisma_client_1 = __importDefault(require("./database/prisma-client"));
const cron_jobs_1 = __importDefault(require("./cron-jobs"));
const mail_templates_route_1 = __importDefault(require("./api/routes/mail-templates.route"));
const scheduled_mails_router_1 = __importDefault(require("./api/routes/scheduled-mails.router"));
const auth_1 = __importDefault(require("./api/routes/auth"));
const contacts_router_1 = __importDefault(require("./api/routes/contacts.router"));
const contacts_lists_route_1 = __importDefault(require("./api/routes/contacts-lists.route"));
const sent_pending_mails_1 = __importDefault(require("./cron-jobs/jobs/sent-pending-mails"));
const error_handler_middleware_1 = __importDefault(require("./api/middlewares/error-handler.middleware"));
const prisma_error_handler_1 = __importDefault(require("./api/middlewares/prisma-error-handler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, express_fileupload_1.default)({ limits: { fileSize: 50 * 1024 * 1024 } }));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_options_1 = __importDefault(require("./docs/swagger-options"));
const specs = (0, swagger_jsdoc_1.default)(swagger_options_1.default);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use('/api', mail_templates_route_1.default);
app.use('/api', scheduled_mails_router_1.default);
app.use('/api', auth_1.default);
app.use('/api', contacts_router_1.default);
app.use('/api', contacts_lists_route_1.default);
app.get('/test', async (req, res, next) => {
    const result = await (0, sent_pending_mails_1.default)();
    res.json({ result });
});
app.get('/tracking', (req, res) => {
    const emailId = req.query.emailId;
    console.log(`Email with ID ${emailId} was opened`);
    prisma_client_1.default.sentMail.update({
        where: {
            id: "emailId",
        },
        data: {
            emailStatus: 'OPENED',
        },
    });
    const base64Image = 'R0lGODlhAQABAIAAAP///////ywAAAAAAQABAAACAkQBADs=';
    const imgBuffer = Buffer.from(base64Image, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': imgBuffer.length,
    });
    res.end(imgBuffer);
});
app.use(prisma_error_handler_1.default);
app.use(error_handler_middleware_1.default);
(0, cron_jobs_1.default)();
exports.default = app;
//# sourceMappingURL=app.js.map