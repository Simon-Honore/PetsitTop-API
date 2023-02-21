const debug = require('debug')('opet:userRouter');

const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const controllerHandler = require('../controllers/controllerHandler');

userRouter.get('/users', controllerHandler(userController.getAllUsers));

module.exports = userRouter;
