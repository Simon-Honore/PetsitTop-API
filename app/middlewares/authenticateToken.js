const debug = require('debug')('opet:authenticateToken');
const jwt = require('jsonwebtoken'); // Json Web Tokens for authentification

/**
 * Middleware that checks the JWT
 * and allows to go on to the next middleware if OK,
 * or sends a 401 error if JWT missing or wrong
 *
 * @param {Object} request
 * @param {Object} response
 * @param {function} next - go to next mw function
 */
// eslint-disable-next-line consistent-return
module.exports = function authenticateToken(request, _, next) {
  debug('authenticateToken');
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  debug('token', token);

  if (!token) {
    const error = { statusCode: 401, message: 'Invalid credentials' };
    return next(error);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    debug('jwt.verify');
    if (err) {
      const error = { statusCode: 401, message: 'Invalid credentials' };
      return next(error);
    }

    request.user = user;
    debug('request.user', request.user);

    return next();
  });
};
