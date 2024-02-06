import { Readable } from 'stream';
import { google } from 'googleapis';
import fileUpload from 'express-fileupload';

import OAuth2GoogleClient from './auth-google-client';


const googleDriveClient = google.drive({ version: 'v3', auth: OAuth2GoogleClient });

const createNewMailTemplateFile = async (templateName: string, templateFile: fileUpload.UploadedFile) => {
    const templateFileStream = new Readable();

    templateFileStream.push(templateFile.data);
    templateFileStream.push(null);

    const createdFile = await googleDriveClient.files.create({
        requestBody: {
            name: templateName,
            mimeType: 'text/html',
            parents: ['183Sg_7KPVGeqZT_1nT4GTq9Y43gw88uB'],
        },
        media: {
            mimeType: 'text/html',
            body: templateFileStream
        }
    });

    return createdFile;
};

const getMailTemplateFileDataById = async (fileId: string) => {
    const response = await googleDriveClient.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' }
    );

    return new Promise<string>((resolve, reject) => {
        let data = '';
        response.data
            .on('data', chunk => data += chunk)
            .on('end', () => {
                resolve(data);
            })
        //TODO: Handle error while reading file
    });
};

const updateMailTemplateFileById = async (fileId: string, data: string) => {
    const updatedFile = await googleDriveClient.files.update({
        fileId: fileId,
        media: {
            mimeType: 'text/html',
            body: data
        }
    });
    console.log(updatedFile)
    return updatedFile;
};

const deleteMailTemplateFileById = async (fileId: string) => {
    const deletedFile = await googleDriveClient.files.delete({
        fileId: fileId,
    });
    
    return deletedFile;
};


export default {
    createNewMailTemplateFile,
    updateMailTemplateFileById,
    deleteMailTemplateFileById,
    getMailTemplateFileDataById,
};