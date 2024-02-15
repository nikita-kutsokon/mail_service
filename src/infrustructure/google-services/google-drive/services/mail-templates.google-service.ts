import { Readable } from 'stream';
import fileUpload from 'express-fileupload';

import googleDriveProvider from '../providers';


const createNewMailTemplateFile = async (templateName: string, templateFile: fileUpload.UploadedFile) => {
    const templateFileStream = new Readable();

    templateFileStream.push(templateFile.data);
    templateFileStream.push(null);

    const createdFile = await googleDriveProvider.files.create({
        requestBody: {
            name: templateName,
            mimeType: 'text/html',
            parents: [ process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID_WITH_MAIL_TEMPLATES ],
        },
        media: {
            mimeType: 'text/html',
            body: templateFileStream
        }
    });

    return createdFile;
};

const getMailTemplateFileDataById = async (fileId: string) => {
    const response = await googleDriveProvider.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' }
    );

    return new Promise<string>((resolve, reject) => {
        let data = '';
        response.data
            .on('data', chunk => data += chunk)
            .on('end', () => resolve(data))
            .on('error', reject);
    });
};

const updateMailTemplateFileById = async (fileId: string, data: string) => {
    const updatedFile = await googleDriveProvider.files.update({
        fileId: fileId,
        media: {
            mimeType: 'text/html',
            body: data
        }
    });
    
    return updatedFile;
};

const deleteMailTemplateFileById = async (fileId: string) => {
    const deletedFile = await googleDriveProvider.files.delete({ fileId });
    
    return deletedFile;
};


export default {
    createNewMailTemplateFile,
    updateMailTemplateFileById,
    deleteMailTemplateFileById,
    getMailTemplateFileDataById,
};