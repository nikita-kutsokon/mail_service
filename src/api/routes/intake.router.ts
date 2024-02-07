import { Router } from 'express';

import IntakeController from '../controllers/intake.controller';

import validateBody from '../middlewares/request-body-validator';
import isValidId from '../middlewares/request-id-validator.middleware';

import intakeRequestSchemas from '../request-schemas/intake.request-schemas';


const router = Router();

router.get(
    '/',
    IntakeController.getRecordsList
);

router.post(
    '/',
    validateBody(intakeRequestSchemas.createResourse),
    IntakeController.createRecord
);

router.get(
    '/:id',
    isValidId,
    IntakeController.getRecordById
);

router.put(
    '/:id',
    isValidId,
    validateBody(intakeRequestSchemas.updateResource),
    IntakeController.updateRecordById
);

router.delete(
    '/:id',
    isValidId,
    IntakeController.delteRecordById
);

router.get(
    '/:id/country-source-stats',
    isValidId,
    IntakeController.getCountrySourceStats
);

export default router;