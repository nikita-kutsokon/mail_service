import { google } from 'googleapis';

const googleOAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CLIENT_REDIRECT_URI
);

googleOAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_CLIENT_REFRESH_TOKEN });

export default googleOAuth2Client;