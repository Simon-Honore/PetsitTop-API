const Joi = require('joi');

const schemas = {
  post: Joi.object({
    name: Joi
      .string()
      .pattern(/^[a-zA-ZÀ-ÿ '-]{2,}$/)
      .required(),
    presentation: Joi
      .string()
      .max(250)
      .allow(''),
    pet_type_id: Joi
      .number()
      .integer()
      .required(),
  }).required(),
  put: Joi.object({
    name: Joi
      .string()
      .pattern(/^[a-zA-ZÀ-ÿ '-]{2,}$/)
      .required(),
    presentation: Joi
      .string()
      .max(250)
      .allow(''),
    pet_type_id: Joi
      .number()
      .integer()
      .required(),
  }).required(),
};

module.exports = schemas;
