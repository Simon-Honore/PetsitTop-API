const Joi = require('joi');

const schemas = {
  get: Joi.object({
    name: Joi
      .string()
      .min(2)
      .pattern(/^[a-zA-ZÀ-ÿ '-][a-zA-ZÀ-ÿ '-]+$/)
      .required(),
    presentation: Joi
      .string()
      .max(250)
      .allow(''),
    user_id: Joi
      .number()
      .integer()
      .required(),
    pet_type_id: Joi
      .number()
      .integer()
      .required(),
  }).required(),
  //   patch: Joi.object({

//   }).required(),
};

module.exports = schemas;
