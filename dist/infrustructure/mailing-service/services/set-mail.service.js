"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const prisma_client_1 = __importDefault(require("../../../database/prisma-client"));
const createRecord = async (mailData) => {
    const identifierString = `${mailData.contactId}-${mailData.templateId}-${Date.now()}`;
    const sentedmMail = await prisma_client_1.default.sentMail.create({
        data: {
            ...mailData,
            emailId: (0, uuid_1.v5)(identifierString, uuid_1.v5.URL)
        }
    });
    return sentedmMail;
};
exports.default = {
    createRecord
};
//# sourceMappingURL=set-mail.service.js.map