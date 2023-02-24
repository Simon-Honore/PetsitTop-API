const debug = require('debug')('opet:router');

const mainRouter = require('express').Router();

const userRouter = require('./userRouter');
const petRouter = require('./petRouter');
const adRouter = require('./adRouter');

const controllerHandler = require('../controllers/controllerHandler');
const opetErrorController = require('../controllers/errorController');
const authController = require('../controllers/authController');

mainRouter.post('/login', controllerHandler(authController.checkToken));

// mainRouter.use('/users', userRouter);
mainRouter.use(userRouter);
mainRouter.use(petRouter);
mainRouter.use(adRouter);

mainRouter.use(opetErrorController.error404);
mainRouter.use(opetErrorController.errorHandler);

module.exports = mainRouter;
