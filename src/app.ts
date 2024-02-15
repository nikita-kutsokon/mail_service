import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import startCronJobs from './cron-jobs';

import swaggerSetup from './docs';

import AuthRouter from './api/routes/auth';
import PublicApiRouter from './api/public-api.router';
import InfrustructureRouter from './infrustructure/router';

import ContactActionsRouter from './user-actions-system/routes/contact-actions.router';

import errorHandler from './api/middlewares/error-handler.middleware';
import prismaErrorHandler from './api/middlewares/prisma-error-handler';


dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

app.use('/docs', swaggerSetup.serve, swaggerSetup.setup);

app.use('/api', AuthRouter);
app.use('/api', PublicApiRouter);
app.use('/action', ContactActionsRouter)
app.use(InfrustructureRouter)
// app.use("/contact-form-creation", ContactFormCreation)
app.use('/action', ContactActionsRouter);

import moment from 'moment';
import { Prisma } from '@prisma/client';

const generateEqTimestampFieldBasedOnEqSelectedDate = (contactData: Prisma.ContactCreateInput, date: string) => {

  const momentDate = moment(date);
  const formatedDate = momentDate.tz(contactData.timezone).format('MMMM DD, YYYY HH:mm');

  return `${formatedDate} ${contactData.timezone}`;
};

app.use('/test', async (req,res) => {

  const { contactIds } = await prismaClient.contactstList.findUnique({ where: { id: '65b3888f9f2fc3e417c3bc6f'}});
  
  // const { contactIds } = await prismaClient.contactstList.findUnique({ where: { id: '65b3888f9f2fc3e417c3bc6f'}});

  // for (const contactId of contactIds) {
  //   const contactData = await prismaClient.contact.findUnique({ where: { id: contactId } });
  //   const updatingData = await prismaClient.contact.update({ where: {id: contactId}, data: {
  //     eduQuestSelectedDateTime: '2024-02-16T14:00:00.000+00:00',
  //     eduQuestEventTimestamp: generateEqTimestampFieldBasedOnEqSelectedDate(contactData, '2024-02-16T14:00:00.000+00:00')
  //   } });

  //   console.log(updatingData);
  // }
  
  // res.status(200).json({ messege: 'Ok' });
});

startCronJobs();

app.use(prismaErrorHandler);
app.use(errorHandler);

export default app;