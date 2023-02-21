const debug = require('debug')('opet:errorController');
const NotFoundError = require('../errors/NotFoundError');

const opetErrorController = {
  error404(_, res, next) {
    const error = new NotFoundError();
    next(error);
  },
  errorHandler(err, req, res, next) {
    debug(err.message);
    const status = err.statusCode || 500;
    const { message } = err;
    res.status(status).json({ error: message });
  },
};

module.exports = opetErrorController;
