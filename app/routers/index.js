const debug = require('debug')('opet:router');

const mainRouter = require('express').Router();

const userRouter = require('./userRouter');
const petRouter = require('./petRouter');
const adRouter = require('./adRouter');

const controllerHandler = require('../controllers/controllerHandler');
const opetErrorController = require('../controllers/errorController');
const authController = require('../controllers/authController');

/**
 * a UserLoginPost type
 *
 * @typedef {object} UserLoginPost
 * @property {string} email - user's email adress
 * @property {string} password - user's encrypted password
 */

/**
 * a UserLoggedIn type
 *
 * @typedef {object} UserLoggedIn
 * @property {string} accessToken - the generated token (JWT)
 * @property {number} userId - user's id
 * @property {boolean} logged - logged = true
 */

/**
 * POST /login
 *
 * @summary logs a user and creates a JWT
 * @tags Tokens
 *
 * @param {UserLoginPost} request.body - user login information
 *
 * @return {UserLoggedIn} 200 - success response
 * @return {object} 401 - invalid credentials
 */
mainRouter.post('/login', controllerHandler(authController.checkToken));

// mainRouter.use('/users', userRouter);
mainRouter.use(userRouter);
mainRouter.use(petRouter);
mainRouter.use(adRouter);

mainRouter.use(opetErrorController.error404);
mainRouter.use(opetErrorController.errorHandler);

module.exports = mainRouter;
