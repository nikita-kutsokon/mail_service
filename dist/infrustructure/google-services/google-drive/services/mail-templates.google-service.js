"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const providers_1 = __importDefault(require("../providers"));
const createNewMailTemplateFile = async (templateName, templateFile) => {
    const templateFileStream = new stream_1.Readable();
    templateFileStream.push(templateFile.data);
    templateFileStream.push(null);
    const createdFile = await providers_1.default.files.create({
        requestBody: {
            name: templateName,
            mimeType: 'text/html',
            parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID_WITH_MAIL_TEMPLATES],
        },
        media: {
            mimeType: 'text/html',
            body: templateFileStream
        }
    });
    return createdFile;
};
const getMailTemplateFileDataById = async (fileId) => {
    const response = await providers_1.default.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' });
    return new Promise((resolve, reject) => {
        let data = '';
        response.data
            .on('data', chunk => data += chunk)
            .on('end', () => resolve(data))
            .on('error', reject);
    });
};
const updateMailTemplateFileById = async (fileId, data) => {
    const updatedFile = await providers_1.default.files.update({
        fileId: fileId,
        media: {
            mimeType: 'text/html',
            body: data
        }
    });
    return updatedFile;
};
const deleteMailTemplateFileById = async (fileId) => {
    const deletedFile = await providers_1.default.files.delete({ fileId });
    return deletedFile;
};
exports.default = {
    createNewMailTemplateFile,
    updateMailTemplateFileById,
    deleteMailTemplateFileById,
    getMailTemplateFileDataById,
};
//# sourceMappingURL=mail-templates.google-service.js.map