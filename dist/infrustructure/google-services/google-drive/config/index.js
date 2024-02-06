"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const config_1 = __importDefault(require("../../config"));
const googleDriveProvider = googleapis_1.google.drive({ version: 'v3', auth: config_1.default });
exports.default = googleDriveProvider;
//# sourceMappingURL=index.js.map