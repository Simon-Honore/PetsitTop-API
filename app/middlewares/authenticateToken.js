const debug = require('debug')('opet:authenticateToken');
const jwt = require('jsonwebtoken'); // Json Web Tokens for authentification

// eslint-disable-next-line consistent-return
module.exports = async function authenticateToken(request, response, next) {
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
