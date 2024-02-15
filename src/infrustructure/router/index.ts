import Router, { Request, Response } from 'express';

import processContactsEqDecision from './sending-eq-results';
import applyingInternshipHandler from './applying-internship';

const router = Router();

router.post('/contact-form-creation', async (req: Request, res: Response) => {
    const contactData = req.body;
    const userIpAddress = ((req.headers['x-forwarded-for'] as string) || '').split(',')[0].trim() || req.socket.remoteAddress;

    const result = await applyingInternshipHandler(contactData, userIpAddress);

    res.status(200).send('OK');
});

router.post('/process-contacts-results', async (req: Request, res: Response) => {
    const data = req.body;
    const result = await processContactsEqDecision(data);

    res.status(200).json(result)
});

export default router;