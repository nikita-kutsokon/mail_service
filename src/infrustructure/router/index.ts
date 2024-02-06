import Router, { Request, Response } from 'express';
import applyingInternshipHandler from './applying-internship/contact-creation.service';

const router = Router();

router.post('/contact-form-creation', async (req: Request, res: Response) => {
    const contactData = req.body;
    const userIpAddress = ((req.headers['x-forwarded-for'] as string) || '').split(',')[0].trim() || req.socket.remoteAddress;

    const result = await applyingInternshipHandler(contactData, userIpAddress);

    res.status(200).send('OK');
});

export default router;