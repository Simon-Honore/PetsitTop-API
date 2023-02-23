const debug = require('debug')('opet:validator');

/**
 * Factory returning a validation middleware
 * @param {Object} schema - the Joi schema
 * @param {('query'|'body'|'params')} dataSource - the data source object ex: query, body (req.query)
 * @returns {function} a function (factory) async Middleware (req, res, next)
 */
function validate(schema, dataSource) {
  debug('create a customized validation middleware');
  return async (request, response, next) => {
    try {
      await schema.validateAsync(request[dataSource]);
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validate;
