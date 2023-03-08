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
  // extract token from headers:
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  debug('token', token);

  // if no token found => 401
  if (!token) {
    const error = { statusCode: 401, message: 'Invalid credentials' };
    return next(error);
  }

  // if there is a token, we check it with ACCES_TOKEN_SECRET in .env
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    debug('jwt.verify');
    // if it doesn't match => 401
    if (err) {
      const error = { statusCode: 401, message: 'Invalid credentials' };
      return next(error);
    }

    // if ok : we get to next middleware with this logged in user
    request.user = user;
    debug('request.user', request.user);

    return next();
  });
};
