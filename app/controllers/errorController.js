const debug = require('debug')('opet:errorController');

const opetErrorController = {
  /**
 * express 404 error middleware: sends a 404 error to the express error middleware
 *
 * @param {Object} _ - http request object
 * @param {Object} response - http response object
 * @param {function} next - go to next mw function
 */
  error404(_, response, next) {
    const error = { statusCode: 404, message: 'No resource found' };
    next(error);
  },

  /**
 * express error middleware
 *
 * @param {Error} error - an error
 * @param {Object} _ - http request object
 * @param {Object} response - http response object
 * @param {function} next - go to next mw function
 */
  // eslint-disable-next-line no-unused-vars
  errorHandler(error, _, response, next) {
    // debug(err.originalError?.message || err.message);
    debug(error.message);
    console.log(error.message); // For debugging online
    let status = error.statusCode || 500; // 500 : Internal Server Error
    let { message } = error;

    // Validation errors(Joi)
    if (error.name === 'ValidationError') {
      status = 400; // 400: Bad Request
      message = 'Les données transmises ne sont pas valides'; // error message sent to API
    }

    // Specific Internal Server Errors:
    // 23505 : violation of unique constraint
    // 23503 : violation of foreign key constraint
    if (error.code === '23505' || error.code === '23503') {
      let { detail } = error;
      detail += ` Table : ${error.table}`;
      debug(error.code, detail);
    }

    response.status(status).json({ error: message });
  },
};

module.exports = opetErrorController;
