const debug = require('debug')('opet:userRouter');

const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: userPostSchema } = require('../validations/schemas/user.schema');
const { get: userGetSchema } = require('../validations/schemas/user.schema');
const { patch: userPatchSchema } = require('../validations/schemas/user.schema');

// User routes
userRouter.get('/users/:id([0-9]+)', controllerHandler(userController.getOneUser));
userRouter.patch('/users/:id([0-9]+)', validate(userPatchSchema, 'body'), controllerHandler(userController.modifyUser));
userRouter.get('/users', validate(userGetSchema, 'query'), controllerHandler(userController.getSearchResults));
userRouter.post('/users', validate(userPostSchema, 'body'), controllerHandler(userController.createUser));

module.exports = userRouter;
