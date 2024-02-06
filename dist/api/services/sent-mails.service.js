"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../../database/prisma-client"));
const createRecord = async (data) => {
    const createdRecord = await prisma_client_1.default.sentMail.create({ data: data });
    return createdRecord;
};
exports.default = {
    createRecord
};
//# sourceMappingURL=sent-mails.service.js.map