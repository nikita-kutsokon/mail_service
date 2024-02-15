import Joi from 'joi';

const validStatusValues = ['CLOSED', 'OPENED'];
const validProgramValues = ['WEEKDAY','WEEKEND'];

const createResourse = Joi.object({
    eventDate: Joi.date().required(), 
    orientationEventDateTime: Joi.date().required(),   
    firstInternshipClassDateTime: Joi.date().required(), 
    applicationDeadline: Joi.date().required(),                         
    programType: Joi.string().valid(...validProgramValues).required(),               
    status: Joi.string().valid(...validStatusValues),   
});

const updateResource = Joi.object({
    eventDate: Joi.date(), 
    orientationEventDateTime: Joi.date(),   
    firstInternshipClassDateTime: Joi.date(),    
    applicationDeadline: Joi.date(),                           
    programType: Joi.string().valid(...validProgramValues),               
    status: Joi.string().valid(...validStatusValues),   
});

export default {
    createResourse,
    updateResource
};