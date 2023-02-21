const debug = require('debug')('opet:userRouter');

const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const controllerHandler = require('../controllers/controllerHandler');

userRouter.get('/users', controllerHandler(userController.getSearchResults));
userRouter.post('/users', controllerHandler(userController.createUser));

module.exports = userRouter;
