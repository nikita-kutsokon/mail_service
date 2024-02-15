import Joi from 'joi';

const createResourseSchema = Joi.object({
  name: Joi.string().required(),
  eduQuestStartDate: Joi.date().iso(),
});

const updateResourseSchema = Joi.object({
  name: Joi.string(),
  eduQuestStartDate: Joi.date().iso(),
});

const addRecordContactsToMailingAutomationSchema = Joi.object({
  listId: Joi.string().required(),
  mailingAutomationId: Joi.string().required()
});

export default {
  createResourseSchema,
  updateResourseSchema,
  addRecordContactsToMailingAutomationSchema
}