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

import ContactFormCreation from './infrustructure/services/contact/contactFormCreation'

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


app.use('/test', async (req,res) => {
  res.json({message: "good"})
});

startCronJobs();

app.use(prismaErrorHandler);
app.use(errorHandler);

export default app;