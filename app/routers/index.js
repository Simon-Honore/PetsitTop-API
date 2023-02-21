const debug = require('debug')('opet:router');

const mainRouter = require('express').Router();

const userRouter = require('./userRouter');
const petRouter = require('./petRouter');
const adRouter = require('./adRouter');

const opetErrorController = require('../controllers/errorController');

// mainRouter.use('/users', userRouter);
mainRouter.use(userRouter);
mainRouter.use(petRouter);
mainRouter.use(adRouter);

mainRouter.use(opetErrorController.error404);
mainRouter.use(opetErrorController.errorHandler);

module.exports = mainRouter;
