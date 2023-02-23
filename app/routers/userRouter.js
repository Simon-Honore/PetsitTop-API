const debug = require('debug')('opet:userRouter');

const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: userPostSchema } = require('../validations/schemas/user.schema');
const { get: userGetSchema } = require('../validations/schemas/user.schema');

userRouter.get('/users/:id', controllerHandler(userController.getOneUser));

userRouter.get('/users', validate(userGetSchema, 'query'), controllerHandler(userController.getSearchResults));
userRouter.post('/users', validate(userPostSchema, 'body'), controllerHandler(userController.createUser));

module.exports = userRouter;
