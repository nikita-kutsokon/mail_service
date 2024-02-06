"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gmailClientConfig = {
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
    }
};
exports.default = gmailClientConfig;
//# sourceMappingURL=index.js.map