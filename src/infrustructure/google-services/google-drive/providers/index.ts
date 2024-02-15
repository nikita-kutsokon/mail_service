import { google } from 'googleapis';
import googleOAuth2Client from '../../config';

const googleDriveProvider = google.drive({ version: 'v3', auth: googleOAuth2Client });

export default googleDriveProvider;