"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cron_jobs_1 = __importDefault(require("./cron-jobs"));
const docs_1 = __importDefault(require("./docs"));
const auth_1 = __importDefault(require("./api/routes/auth"));
const public_api_router_1 = __importDefault(require("./api/public-api.router"));
const contact_actions_router_1 = __importDefault(require("./user-actions-system/routes/contact-actions.router"));
const error_handler_middleware_1 = __importDefault(require("./api/middlewares/error-handler.middleware"));
const prisma_error_handler_1 = __importDefault(require("./api/middlewares/prisma-error-handler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
app.use((0, express_fileupload_1.default)({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use('/docs', docs_1.default.serve, docs_1.default.setup);
app.use('/api', auth_1.default);
app.use('/api', public_api_router_1.default);
app.use('/action', contact_actions_router_1.default);
app.use('/test', async (req, res) => {
    (0, cron_jobs_1.default)();
    res.json({ massage: "good" });
});
app.use(prisma_error_handler_1.default);
app.use(error_handler_middleware_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map