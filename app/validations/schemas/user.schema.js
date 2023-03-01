const Joi = require('joi');

const schemas = {
  get: Joi.object({
    department: Joi
      .string()
      .pattern(/(^0[1-9]$)|(^[1-8]\d$)|(^9[0-5]$)/)
      .required(),
    pet_type: Joi
      .string()
      .valid(
        'chien',
        'chat',
        'lapin',
        'rongeur',
        'oiseau',
        'poisson',
        'reptile',
        'autre',
      )
      .required(),
  }).required(),
  post: Joi.object({
    first_name: Joi
      .string()
      .pattern(/^[a-zA-ZÀ-ÿ '-]{2,}$/)
      .required(),
    last_name: Joi
      .string()
      .pattern(/^[a-zA-ZÀ-ÿ '-]{2,}$/)
      .required(),
    email: Joi
      .string()
      .email({
        // the TLD (top level domain) must be a valid name listed on the IANA registry:
        tlds: { allow: true },
      })
      .required(),
    password: Joi
      .string()
      .min(8)
      // MATCHES : minimum 8 characters,
      // at least 1 uppercase letter, 1 lowercase letter, 1 number
      // and 1 special character (@$!%*?&) :
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required(),
    confirmPassword: Joi
      .string()
      .required()
      // "confirmPassword" must match "password"
      .valid(Joi.ref('password')),
    postal_code: Joi
      .string()
      // regex from our SQl DOMAIN "postal_code_fr" in DB
      .pattern(/(^0[1-9]\d{3}$)|(^1\d{4}$)|(^20[012]\d{2}$|^20600$|^20620$)|(^2[1-9]\d{3}$)|(^[3-8]\d{4}$)|(^9[0-5]\d{3}$)/)
      .required(),
    city: Joi
      .string()
      .min(2)
      .required(),
    availability: Joi
      .boolean()
      .required(),
    availability_details: Joi
      .string()
      .max(250)
      .allow(''),
    role_petsitter: Joi
      .boolean()
      .required(),
    role_petowner: Joi
      .boolean()
      .required(),
    pet_type: Joi
      .array()
      .items(Joi.string())
  }).required(),
  put: Joi.object({
    first_name: Joi
      .string()
      .pattern(/^[a-zA-ZÀ-ÿ '-]{2,}$/)
      .required(),
    last_name: Joi
      .string()
      .pattern(/^[a-zA-ZÀ-ÿ '-]{2,}$/)
      .required(),
    email: Joi
      .string()
      .email({
        // the TLD (top level domain) must be a valid name listed on the IANA registry:
        tlds: { allow: true },
      })
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
    role_petsitter: Joi
      .boolean()
      .required(),
    role_petowner: Joi
      .boolean()
      .required(),
    pet_type: Joi
      .array()
      .items(Joi.string())
  }).required(),
};

module.exports = schemas;
