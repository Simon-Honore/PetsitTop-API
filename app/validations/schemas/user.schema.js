const Joi = require('joi');

const schemas = {
  get: Joi.object({
    first_name: Joi
      .string()
      .min(2)
      .pattern(/^[a-zA-ZÀ-ÿ '-][a-zA-ZÀ-ÿ '-]+$/)
      .required(),
    last_name: Joi
      .string()
      .min(2)
      .pattern(/^[a-zA-ZÀ-ÿ '-][a-zA-ZÀ-ÿ '-]+$/)
      .required(),
    email: Joi
      .string()
    // ajouter pattern ?
      .email({
        tlds: { allow: true },
        // the TLD (top level domain) must be a valid name listed on the IANA registry
      }),
    password: Joi
      .string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      // MATCHES : minimum 8 characters,
      // at least 1 uppercase letter, 1 lowercase letter, 1 number
      // and 1 special character (@$!%*?&)
      .required(),
    postal_code: Joi
      .string()
      .min(5)
      .max(5)
      .pattern(/(^0[1-9]\d{3}$)|(^1\d{4}$)|(^20[012]\d{2}$|^20600$|^20620$)|(^2[1-9]\d{3}$)|(^[3-8]\d{4}$)|(^9[0-5]\d{3}$)|(^9[78]\d{3}$)/)
    // regex from our SQl DOMAIN "postal_code_fr" in DB
      .required(),
    city: Joi
      .string()
      .min(2)
      .required(),
    presentation: Joi
      .string()
      .max(350)
      .allow(''), // allows the presentation to be empty
    availability: Joi
      .boolean()
      .required(),
    availability_details: Joi
      .string()
      .max(250)
      .allow(''),
  }).required(),
  //   patch: Joi.object({

//   }).required(),
};

module.exports = schemas;
