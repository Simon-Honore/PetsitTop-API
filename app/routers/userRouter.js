const debug = require('debug')('opet:userRouter');

const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: userPostSchema } = require('../validations/schemas/user.schema');
const { get: userGetSchema } = require('../validations/schemas/user.schema');
const { put: userPutSchema } = require('../validations/schemas/user.schema');

const authenticateToken = require('../middlewares/authenticateToken');

/**
 * a user type
 *
 * @typedef {object} User
 * @property {number} id - user id
 * @property {string} first_name - user's first_name
 * @property {string} last_name - user's last_name
 * @property {string} email - user's email adress
//  * @property {string} presentation - user presentation
//  * @property {number} user_id - user user_id
//  * @property {number} pet_type_id - pet pet_type_id
 * @property {string} created_at - date of creation
 * @property {string} updated_at - date of last update
 */

// User routes
userRouter.get('/users/:id([0-9]+)', authenticateToken, controllerHandler(userController.getOneUser));
userRouter.put('/users/:id([0-9]+)', authenticateToken, validate(userPutSchema, 'body'), controllerHandler(userController.modifyUser));
userRouter.get('/users', validate(userGetSchema, 'query'), controllerHandler(userController.getSearchResults));
userRouter.post('/users', validate(userPostSchema, 'body'), controllerHandler(userController.createUser));

module.exports = userRouter;
