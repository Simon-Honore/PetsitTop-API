const debug = require('debug')('opet:authController');
const jwt = require('jsonwebtoken'); // Json Web Tokens for authentification
const bcrypt = require('bcrypt');

const userDataMapper = require('../models/userDataMapper');

const authController = {

  async checkToken(request, response, next) {
    debug('checkToken');
    const user = await userDataMapper.findUserByEmail(request.body.email);

    // if user doesn't exist in DB => error
    if (!user) {
      const error = { statusCode: 401, message: 'Invalid credentials' };
      return next(error);
    }

    // test to check if password matches the hashed password in DB
    const match = await bcrypt.compare(request.body.password, user.password);

    // if the email adresses don't match or the passwords don't match => error
    if (request.body.email !== user.email || !match) {
      const error = { statusCode: 401, message: 'Invalid credentials' };
      return next(error);
    }

    // if user exists and email+password match => generate token
    const accessToken = authController.generateAccessToken(user);
    debug('token :', accessToken);
    return response.send({ accessToken });
  },

  generateAccessToken(user) {
    debug('generateAccessToken');
    debug('user :', user);
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
  },
};

module.exports = authController;
