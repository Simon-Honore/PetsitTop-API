const debug = require('debug')('opet:errorController');

const opetErrorController = {
  error404(_, res, next) {
    const error = { statusCode: 404, message: 'No resource found' };
    next(error);
  },

  // eslint-disable-next-line no-unused-vars
  errorHandler(err, req, res, next) {
    // debug(err.originalError?.message || err.message);
    debug(err.message);
    let status = err.statusCode || 500; // 500 : Internal Server Error
    let { message } = err;

    // Erreurs de validation (Joi)
    if (err.name === 'ValidationError') {
      status = 400; // 400: Bad Request
      message = 'Les données transmises ne sont pas valides'; // Message d'erreur générique retourné à l'API
    }

    // Internal server Errors:
    // 23505 : contrainte d'unicité
    // 23503 : contrainte de clé étrangère
    if (err.code === '23505' || err.code === '23503') {
      let { detail } = err;
      detail += ` Table : ${err.table}`;
      debug(err.code, detail);
    }

    res.status(status).json({ error: message });
  },
};

module.exports = opetErrorController;
