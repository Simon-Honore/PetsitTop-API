const Joi = require('joi');

const schemas = {
  get: Joi.object({
    limit: Joi
      .number()
      .integer()
      .min(1)
      .max(25)
      .default(10),
    start: Joi
      .number()
      .integer()
      .min(0)
      .default(0),
  }),
  post: Joi.object({
    title: Joi
      .string()
      .max(250)
      .required(),
    content: Joi
      .string()
      .max(250)
      .required(),
    postal_code: Joi
      .string()
      // regex from our SQl DOMAIN "postal_code_fr" in DB
      .pattern(/(^0[1-9]\d{3}$)|(^1\d{4}$)|(^20[012]\d{2}$|^20600$|^20620$)|(^2[1-9]\d{3}$)|(^[3-8]\d{4}$)|(^9[0-5]\d{3}$)/)
      .required(),
    city: Joi
      .string()
      .min(2)
      .required(),
  }).required(),
  put: Joi.object({
    title: Joi
      .string()
      .max(250)
      .required(),
    content: Joi
      .string()
      .max(250)
      .required(),
    postal_code: Joi
      .string()
      // regex from our SQl DOMAIN "postal_code_fr" in DB
      .pattern(/(^0[1-9]\d{3}$)|(^1\d{4}$)|(^20[012]\d{2}$|^20600$|^20620$)|(^2[1-9]\d{3}$)|(^[3-8]\d{4}$)|(^9[0-5]\d{3}$)/)
      .required(),
    city: Joi
      .string()
      .min(2)
      .required(),
  }).required(),
};

module.exports = schemas;
